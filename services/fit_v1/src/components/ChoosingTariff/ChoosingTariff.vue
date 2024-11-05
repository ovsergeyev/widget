<script lang="ts" setup>
import { ref } from 'vue';
import TariffCard from '../TariffCard/TariffCard.vue';
import TariffInfoPopup from '../Popups/TariffInfoPopup.vue';
import presets from './presets';
import { useTariffsStore } from '../../store/tariffs';
import { useConfigStore } from '../../store/config';
import ITariff from '../../types/ITariff';

const tariffsStore = useTariffsStore();
const configStore = useConfigStore();

const showTariffPopup = ref(false);
const popupTitle = ref('');
const popupDescription = ref('');

const openAboutPopup = (tariff: ITariff) => {
  console.log('event', tariff);
  showTariffPopup.value = true;
  popupTitle.value = tariff.adminTitle;
  popupDescription.value = tariff.description;
};

</script>

<template>
  <div
    id="choosing-tariff"
    :class="presets.root.class"
    v-if="tariffsStore.availableTariffs.length"
  >
    <div :class="presets.inner.class">
      <div>
        <h3 :class="presets.title.class">Тарифы</h3>
        <div :class="presets.description.class">
          {{ configStore.config.description }}
        </div>
      </div>

    </div>

    <div :class="presets.wrapCards.class">
      <TariffCard
        v-for="tariff in tariffsStore.availableTariffs"
        :key="tariff.id"
        :tariff="tariff"
        @click-info="openAboutPopup(tariff)"
      />
    </div>

  </div>

  <TariffInfoPopup
    v-if="showTariffPopup"
    :description="popupDescription"
    :title="popupTitle"
    @hide="showTariffPopup = false"
  />

</template>