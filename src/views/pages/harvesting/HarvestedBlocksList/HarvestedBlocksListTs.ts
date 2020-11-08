import { Observable } from 'rxjs';
import { AccountInfo } from 'symbol-sdk';
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
import { Vue, Component } from 'vue-property-decorator';
import { mapGetters } from 'vuex';
import { IHarvestedBlock } from '@/store/Harvesting';

@Component({
    components: {},
    computed: {
        ...mapGetters({
            harvestedBlocks$: 'harvesting/harvestedBlocks',
        }),
    },
})
export default class HarvestedBlocksListTs extends Vue {
    private harvestedBlocks$: Observable<IHarvestedBlock>;

    public blockList: IHarvestedBlock = null;

    private columns = [
        {
            title: 'Block',
            key: 'block',
        },
        {
            title: 'Fees Earned',
            key: 'fee',
        },
    ];

    created() {
        this.$store.dispatch('harvesting/STREAMER_HARVESTED_BLOCKS', { pageNumber: 1, pageSize: 20 });
    }

    protected get harvestedBlockList() {
        return this.blockList;
    }
}
