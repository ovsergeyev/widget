<template>
  <InputText type="text" size="small" placeholder="Small" />
  <InputText type="text" placeholder="Normal" />
  <InputText type="text" size="large" placeholder="Large" />

  <div class="flex flex-col gap-2">
    <label for="username">Username</label>
    <InputText id="username" v-model="value" aria-describedby="username-help" />
    <small id="username-help">Enter your username to reset your password.</small>
  </div>
</template>