<script lang="ts" setup>
import { buttonPreset } from '@/assets/presets/button/index.ts';
import { ref } from 'vue';



const loading = ref(false);
</script>

<template>
  <div class="flex justify-between flex-initial flex-wrap">
    <Button class="self-start" icon="pi pi-home" aria-label="Save" />
    <Button class="self-start" label="Profile" icon="pi pi-user" />
    <Button class="self-start" label="Save" icon="pi pi-check" iconPos="right" />
    <Button class="self-start" label="Search" icon="pi pi-search" iconPos="top" />
    <Button class="self-start" label="Update" icon="pi pi-refresh" iconPos="bottom" />
    <Button class="self-start" type="button" label="Search" icon="pi pi-search" :loading="loading" @click="loading = true" />
    <Button class="self-start" label="Primary" />
    <Button class="self-start" label="Secondary" severity="secondary" />
    <Button class="self-start" label="Success" severity="success" />
    <Button class="self-start" label="Info" severity="info" />
    <Button class="self-start" label="Warn" severity="warn" />
    <Button class="self-start" label="Help" severity="help" />
    <Button class="self-start" label="Danger" severity="danger" />
    <Button class="self-start" label="Contrast" severity="contrast" />
    <Button class="self-start" label="Primary" raised />
    <Button class="self-start" label="Secondary" severity="secondary" raised />
    <Button class="self-start" label="Success" severity="success" raised />
    <Button class="self-start" label="Info" severity="info" raised />
    <Button class="self-start" label="Warn" severity="warn" raised />
    <Button class="self-start" label="Help" severity="help" raised />
    <Button class="self-start" label="Danger" severity="danger" raised />
    <Button class="self-start" label="Contrast" severity="contrast" raised />
    <Button class="self-start" label="Primary" rounded raised />
    <Button class="self-start" label="Primary" text />
    <Button class="self-start" label="Secondary" severity="secondary" text />
    <Button class="self-start" label="Success" severity="success" text />
    <Button class="self-start" label="Info" severity="info" text />
    <Button class="self-start" label="Warn" severity="warn" text />
    <Button class="self-start" label="Help" severity="help" text />
    <Button class="self-start" label="Danger" severity="danger" text />
    <Button class="self-start" label="Plain" plain text />
    <Button class="self-start" label="Primary" text raised />
    <Button class="self-start" label="Secondary" severity="secondary" text raised />
    <Button class="self-start" label="Success" severity="success" text raised />
    <Button class="self-start" label="Info" severity="info" text raised />
    <Button class="self-start" label="Warn" severity="warn" text raised />
    <Button class="self-start" label="Help" severity="help" text raised />
    <Button class="self-start" label="Danger" severity="danger" text raised />
    <Button class="self-start" label="Plain" plain text raised />
    <Button class="self-start" label="Primary" outlined />
    <Button class="self-start" label="Secondary" severity="secondary" outlined />
    <Button class="self-start" label="Success" severity="success" outlined />
    <Button class="self-start" label="Info" severity="info" outlined />
    <Button class="self-start" label="Warn" severity="warn" outlined />
    <Button class="self-start" label="Help" severity="help" outlined />
    <Button class="self-start" label="Danger" severity="danger" outlined />
    <Button class="self-start" label="Contrast" severity="contrast" outlined />

    <Button class="self-start" icon="pi pi-check" aria-label="Filter" />
    <Button class="self-start" icon="pi pi-bookmark" severity="secondary" aria-label="Bookmark" />
    <Button class="self-start" icon="pi pi-search" severity="success" aria-label="Search" />
    <Button class="self-start" icon="pi pi-user" severity="info" aria-label="User" />
    <Button class="self-start" icon="pi pi-bell" severity="warn" aria-label="Notification" />
    <Button class="self-start" icon="pi pi-heart" severity="help" aria-label="Favorite" />
    <Button class="self-start" icon="pi pi-times" severity="danger" aria-label="Cancel" />
    <Button class="self-start" icon="pi pi-star" severity="contrast" aria-label="Star" />

    <Button icon="pi pi-check" rounded aria-label="Filter" />
    <Button class="self-start" icon="pi pi-bookmark" severity="secondary" rounded aria-label="Bookmark" />
    <Button class="self-start" icon="pi pi-search" severity="success" rounded aria-label="Search" />
    <Button class="self-start" icon="pi pi-user" severity="info" rounded aria-label="User" />
    <Button class="self-start" icon="pi pi-bell" severity="warn" rounded aria-label="Notification" />
    <Button class="self-start" icon="pi pi-heart" severity="help" rounded aria-label="Favorite" />
    <Button class="self-start" icon="pi pi-times" severity="danger" rounded aria-label="Cancel" />
    <Button class="self-start" icon="pi pi-star" severity="contrast" rounded aria-label="Star" />

    <Button class="self-start" icon="pi pi-check" rounded outlined aria-label="Filter" />
    <Button class="self-start" icon="pi pi-bookmark" severity="secondary" rounded outlined aria-label="Bookmark" />
    <Button class="self-start" icon="pi pi-search" severity="success" rounded outlined aria-label="Search" />
    <Button class="self-start" icon="pi pi-user" severity="info" rounded outlined aria-label="User" />
    <Button class="self-start" icon="pi pi-bell" severity="warn" rounded outlined aria-label="Notification" />
    <Button class="self-start" icon="pi pi-heart" severity="help" rounded outlined aria-label="Favorite" />
    <Button class="self-start" icon="pi pi-times" severity="danger" rounded outlined aria-label="Cancel" />
    <Button class="self-start" icon="pi pi-star" severity="contrast" rounded outlined aria-label="Star" />

    <Button class="self-start" icon="pi pi-check" text raised rounded aria-label="Filter" />
    <Button class="self-start" icon="pi pi-bookmark" severity="secondary" text raised rounded aria-label="Bookmark" />
    <Button class="self-start" icon="pi pi-search" severity="success" text raised rounded aria-label="Search" />
    <Button class="self-start" icon="pi pi-user" severity="info" text raised rounded aria-label="User" />
    <Button class="self-start" icon="pi pi-bell" severity="warn" text raised rounded aria-label="Notification" />
    <Button class="self-start" icon="pi pi-heart" severity="help" text raised rounded aria-label="Favorite" />
    <Button class="self-start" icon="pi pi-times" severity="danger" text raised rounded aria-label="Cancel" />
    <Button class="self-start" icon="pi pi-star" severity="contrast" text raised rounded aria-label="Star" />

    <Button class="self-start" icon="pi pi-check" text rounded aria-label="Filter" />
    <Button class="self-start" icon="pi pi-bookmark" severity="secondary" text rounded aria-label="Bookmark" />
    <Button class="self-start" icon="pi pi-search" severity="success" text rounded aria-label="Search" />
    <Button class="self-start" icon="pi pi-user" severity="info" text rounded aria-label="User" />
    <Button class="self-start" icon="pi pi-bell" severity="warn" text rounded aria-label="Notification" />
    <Button class="self-start" icon="pi pi-heart" severity="help" text rounded aria-label="Favorite" />
    <Button class="self-start" icon="pi pi-times" severity="danger" text rounded aria-label="Cancel" />
    <Button class="self-start" icon="pi pi-star" severity="contrast" text rounded aria-label="Star" />

    <Button class="self-start" type="button" label="Emails" badge="2" />
    <Button class="self-start" type="button" label="Messages" icon="pi pi-users" badge="2" badgeSeverity="contrast" outlined />

    <ButtonGroup>
      <Button class="self-start" label="Save" icon="pi pi-check" />
      <Button class="self-start" label="Delete" icon="pi pi-trash" />
      <Button class="self-start" label="Cancel" icon="pi pi-times" />
    </ButtonGroup>

    <Button class="self-start" label="Small" icon="pi pi-check" size="small" />
    <Button class="self-start" label="Normal" icon="pi pi-check" />
    <Button class="self-start" label="Large" icon="pi pi-check" size="large" />

  </div>
</template>