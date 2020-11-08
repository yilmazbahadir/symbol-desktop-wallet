import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
/*
 * Copyright 2020 NEM (https://nem.io)
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */
import { Address, BalanceChangeReceipt, ReceiptPaginationStreamer, ReceiptType, RepositoryFactory, UInt64 } from 'symbol-sdk';
import Vue from 'vue';
// internal dependencies
import { AwaitLock } from './AwaitLock';

const Lock = AwaitLock.create();

export type IHarvestedBlock = {
    blockNo: number;
    fee: UInt64;
};

interface HarvestingState {
    initialized: boolean;
    harvestedBlocks: Observable<IHarvestedBlock>;
    isFetchingHarvestedBlocks: boolean;
}

export default {
    namespaced: true,
    state: {
        initialized: false,
        harvestedBlocks: null,
        isFetchingHarvestedBlocks: false,
    },
    getters: {
        getInitialized: (state) => state.initialized,
        harvestedBlocks: (state) => state.harvestedBlocks,
        isFetchingHarvestedBlocks: (state) => state.isFetchingHarvestedBlocks,
    },
    mutations: {
        setInitialized: (state, initialized) => {
            state.initialized = initialized;
        },
        harvestedBlocks: (state, harvestedBlocks) => Vue.set(state, 'harvestedBlocks', harvestedBlocks),
        isFetchingHarvestedBlocks: (state, isFetchingHarvestedBlocks) =>
            Vue.set(state, 'isFetchingHarvestedBlocks', isFetchingHarvestedBlocks),
    },
    actions: {
        async initialize({ commit, getters }) {
            const callback = async () => {
                // update store
                commit('setInitialized', true);
            };

            // acquire async lock until initialized
            await Lock.initialize(callback, { getters });
        },
        async uninitialize({ commit, getters }) {
            const callback = async () => {
                commit('setInitialized', false);
            };
            await Lock.uninitialize(callback, { getters });
        },
        /// region scoped actions
        RESET_STATE({ commit }) {
            commit('harvestedBlocks', null);
            commit('isFetchingHarvestedBlocks', null);
        },
        STREAMER_HARVESTED_BLOCKS({ commit, rootGetters }, { pageNumber, pageSize }: { pageNumber: number; pageSize: number }) {
            const repositoryFactory: RepositoryFactory = rootGetters['network/repositoryFactory'];
            const receiptRepository = repositoryFactory.createReceiptRepository();
            const streamer = ReceiptPaginationStreamer.transactionStatements(receiptRepository);

            const result = streamer
                .search({
                    pageSize: 20,
                    height: UInt64.fromUint(1),
                    targetAddress: Address.createFromRawAddress('TD5YTEJNHOMHTMS6XESYAFYUE36COQKPW6MQQQY'),
                    receiptTypes: [ReceiptType.Harvest_Fee],
                })
                .pipe(
                    map(
                        (t) =>
                            (({
                                blockNo: t.height,
                                fee: (t.receipts as BalanceChangeReceipt[]).find(
                                    (r) => r.targetAddress === Address.createFromRawAddress('TD5YTEJNHOMHTMS6XESYAFYUE36COQKPW6MQQQY'),
                                ).amount,
                            } as unknown) as IHarvestedBlock),
                    ),
                );

            const test = { blockNo: 0, fee: UInt64.fromNumericString('0') } as IHarvestedBlock;

            commit('harvestedBlocks', result);
        },
        /// end-region scoped actions
    },
};
