<template>
    <AssetFormPageWrap>
        <template v-slot:form-section>
            <FormNamespaceRegistrationTransaction />
        </template>
        <template v-slot:form-description>
            <div class="asset-description-sub-title">
                {{ $t('namespace_name') }}
            </div>
            <div class="asset-description-text">
                <div>
                    {{ $t('namespace_tips_key_1') }}
                </div>
                <div>
                    {{ $t('namespace_tips_value_1') }}
                </div>
                <div>
                    {{ $t('namespace_tips_key_2') }}
                </div>
                <div>
                    {{ $t('namespace_tips_value_2') }}
                </div>
                <div>
                    {{ $t('namespace_tips_key_3') }}
                </div>
            </div>
            <div class="asset-description-sub-title">
                {{ $t('duration') }}
            </div>
            <div class="asset-description-text">
                {{ $t('namespace_duration_tip_1') }}
            </div>
        </template>
    </AssetFormPageWrap>
</template>

<script lang="ts">
// external dependencies
import { Component, Vue } from 'vue-property-decorator';
import { NamespaceRegistrationType } from 'symbol-sdk';
// child components
import AssetFormPageWrap from '@/views/pages/assets/AssetFormPageWrap/AssetFormPageWrap.vue';
import FormNamespaceRegistrationTransaction from '@/views/forms/FormNamespaceRegistrationTransaction/FormNamespaceRegistrationTransaction.vue';
// @ts-ignore
@Component({
    components: { AssetFormPageWrap, FormNamespaceRegistrationTransaction },
    data() {
        return { NamespaceRegistrationType };
    },
})
export default class CreateNamespacePage extends Vue {}
</script>

<style lang="less" scoped>
/deep/ .namespace-transaction-form-wrapper {
    max-width: 14rem;
}
</style>
