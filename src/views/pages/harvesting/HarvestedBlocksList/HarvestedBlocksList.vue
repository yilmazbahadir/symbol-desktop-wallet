<template>
    <div>
        <Table :columns="columns" :data="blockList"></Table>
    </div>
</template>

<script lang="ts">
import HarvestedBlocksListTs from './HarvestedBlocksListTs';

export default class HarvestedBlocksList extends HarvestedBlocksListTs {}
</script>

<style lang="less" scoped>
@import './HarvestedBlocksList.less';
</style>
