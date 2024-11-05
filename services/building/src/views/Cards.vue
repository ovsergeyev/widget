<script lang="ts" setup>
import { card } from '../assets/presets/card';
import { buttonPreset } from '../assets/presets/button/index.ts';
</script>

<template>
  <div class="mb-4">
    <Card>
      <template #title>Simple Card</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
          quas!
        </p>
      </template>
    </Card>
  </div>

  <div>
    <Card style="width: 25rem; overflow: hidden">
      <template #header>
        <img alt="user header" src="../assets/images/card-vue.jpg" />
      </template>
      <template #title>Advanced Card</template>
      <template #subtitle>Card subtitle</template>
      <template #content>
        <p class="m-0">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Inventore sed consequuntur error repudiandae numquam deserunt quisquam repellat libero asperiores earum nam nobis, culpa ratione quam perferendis esse, cupiditate neque
          quas!
        </p>
      </template>
      <template #footer>
        <div class="flex gap-4 mt-1">
          <Button :dt="buttonPreset" label="Cancel" severity="secondary" outlined class="w-full" />
          <Button :dt="buttonPreset" label="Save" class="w-full" />
        </div>
      </template>
    </Card>
  </div>
</template>