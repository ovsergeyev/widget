<template>
  <div class="w-full mx-auto bg-white rounded-xl shadow-md border overflow-hidden flex-grow">
    <!-- <div class="md:flex p-6 pr-3"> -->
    <div class="md:flex p-3">
      <div class="pb-6">
        <!-- <div class="md:shrink-0"> -->
        <!-- <img class="h-48 w-full object-cover md:h-full md:w-48" src="@/assets/images/card-vue.jpg" alt="Modern building architecture"> -->
        <div class="flex gap-1 pr-10">
          <div class="text-text-primary text-6xl">13</div>
          <div class="flex flex-col justify-around">
            <div class="text-xl text-text-green">08</div>
            <div>Вт</div>
          </div>
        </div>

      </div>

      <div class="pl-4 flex-grow">

        <div class="pb-8 border-b-2">
          <div class="flex justify-between items-center">
            <div class="text-xl text-text-primary font-semibold">Будние 2ч 30мин (пакет онлайн)</div>
            <Button class="flex-shrink-0" icon="pi pi-trash" severity="primary" text outlined rounded />
          </div>
          <div class="text-lg text-text-secondary pb-4">8:00 - 12:30</div>

          <div class="pb-4">
            <div>
              <span class="text-text-primary font-semibold">Посещение: </span>
              <span class="text-text-secondary">18:00</span>
            </div>

            <div>
              <span class="text-text-primary font-semibold">Стоимость: </span>
              <span class="text-text-secondary">3350 ₽</span>
            </div>
          </div>


          <div class="flex flex-col xl:flex-row gap-4 pr-4">
            <Button class="text-xs sm:text-base" label="Добавить детский тариф" />
            <Button class="text-xs sm:text-base" label="Удалить детский тариф" />
          </div>

        </div>

        <div class="pt-4 pb-4">
          <div class="flex justify-between items-center">
            <div class="text-xl text-text-primary font-semibold">Будние 2ч 30мин (пакет онлайн)</div>
            <Button icon="pi pi-trash" severity="primary" text outlined rounded />
          </div>
          <div class="text-lg text-text-secondary pb-4">8:00 - 12:30</div>

          <div class="pb-4">
            <div>
              <span class="text-text-primary font-semibold">Посещение: </span>
              <span class="text-text-secondary">18:00</span>
            </div>

            <div>
              <span class="text-text-primary font-semibold">Стоимость: </span>
              <span class="text-text-secondary">3350 ₽</span>
            </div>
          </div>

          <div class="flex flex-col xl:flex-row gap-4">
            <Button class="text-xs sm:text-base" label="Добавить детский тариф" />
            <Button class="text-xs sm:text-base" label="Удалить детский тариф" />
          </div>
        </div>

      </div>

    </div>
  </div>
</template>