<template>
    <div class="form-persistent-delegation-request">
        <FormWrapper>
            <ValidationObserver v-slot="{ handleSubmit }" ref="observer" slim>
                <form onsubmit="event.preventDefault()">
                    <div class="info-text">
                        <span>
                            Storj, IoDLT and Nem have come together to create a unique storage soluton to facilitate faster syncing time
                            when setting up a node on the Symbol network, whether that is rebuilding an old node or starting a new one. The
                            Tardigrade Connector Streamlines the amount of time it takes to...
                        </span>
                    </div>

                    <!-- Transaction signer selector -->
                    <SignerSelector v-model="formItems.signerAddress" :signers="signers" @input="onChangeSigner" />

                    <!-- Node URL Selector -->
                    <NetworkNodeSelector v-model="formItems.nodePublicKey" @change="onNodeChange" />

                    <!-- Transaction fee selector and submit button -->

                    <FormRow>
                        <template v-slot:inputs>
                            <div class="harvesting-buttons-container">
                                <button
                                    v-if="harvestingStatus === 'INACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button inverted-button"
                                    @click="handleSubmit(onStart())"
                                >
                                    {{ $t('start') }}
                                </button>
                                <button
                                    v-if="harvestingStatus === 'ACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button inverted-button"
                                    :disabled="swapDisabled"
                                    @click="handleSubmit(onSwap())"
                                >
                                    {{ $t('swap') }}
                                </button>
                                <button
                                    v-if="harvestingStatus === 'ACTIVE'"
                                    type="submit"
                                    class="centered-button button-style submit-button danger-button"
                                    @click="handleSubmit(onStop())"
                                >
                                    {{ $t('stop_harvesting') }}
                                </button>
                            </div>
                        </template>
                    </FormRow>
                </form>
            </ValidationObserver>
        </FormWrapper>
        <ModalTransactionConfirmation
            v-if="hasConfirmationModal"
            :command="command"
            :visible="hasConfirmationModal"
            @success="onConfirmationSuccess"
            @error="onConfirmationError"
            @close="onConfirmationCancel"
        />
    </div>
</template>

<script lang="ts">
import { FormPersistentDelegationRequestTransactionTs } from './FormPersistentDelegationRequestTransactionTs';
export default class FormPersistentDelegationRequestTransaction extends FormPersistentDelegationRequestTransactionTs {}
</script>

<style lang="less" scoped>
@import './FormPersistentDelegationRequestTransaction.less';
</style>
