import { Vue, Component, Prop, Watch, Emit, Ref } from 'vue-property-decorator';
// @ts-ignore
import FormPersistentDelegationRequestTransaction from '@/views/forms/FormPersistentDelegationRequestTransaction/FormPersistentDelegationRequestTransaction.vue';
import { mapGetters } from 'vuex';

@Component({
    components: { FormPersistentDelegationRequestTransaction },
    computed: {
        ...mapGetters({}),
    },
})
export default class HarvestingPageTs extends Vue {
    created() {}
}
