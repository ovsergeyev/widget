<template>
  <!-- <div class="min-w-80 w-80 mx-auto bg-white rounded-xl shadow-md border overflow-hidden p-6 pb-8"> -->
  <div class="w-full lg:min-w-80 lg:w-80 mx-auto bg-white rounded-xl shadow-md border overflow-hidden p-6 pb-8">
    <div class="mb-6">
      <div class="mb-2">
        <span class="text-text-primary font-semibold">Дата посещения: </span>
        <span class="text-text-secondary">14 августа 2024</span>
      </div>

      <div class="mx-auto p-4 mb-3 bg-white rounded-md shadow-sm border overflow-hidden">
        <div>
          <span class="text-text-primary font-semibold">Посещение: </span>
          <span class="text-text-secondary">18:00</span>
        </div>
        <div>
          <span class="text-text-primary font-semibold">Гостей: </span>
          <span class="text-text-secondary">2 гостя</span>
        </div>
        <div>
          <span class="text-text-primary font-semibold">К оплате: </span>
          <span class="text-text-secondary">3350 ₽</span>
        </div>
      </div>

      <div class="mx-auto p-4 bg-white rounded-md shadow-sm border overflow-hidden">
        <div>
          <span class="text-text-primary font-semibold">Посещение: </span>
          <span class="text-text-secondary">18:00</span>
        </div>
        <div>
          <span class="text-text-primary font-semibold">Гостей: </span>
          <span class="text-text-secondary">2 гостя</span>
        </div>
        <div>
          <span class="text-text-primary font-semibold">К оплате: </span>
          <span class="text-text-secondary">3350 ₽</span>
        </div>
      </div>

      
    </div>

    <div class="mb-6">
      <div class="mb-2">
        <span class="text-text-primary font-semibold">Дата посещения: </span>
        <span class="text-text-secondary">14 августа 2024</span>
      </div>

      <div class="mx-auto p-4 bg-white rounded-md shadow-sm border overflow-hidden">
        <div>
          <span class="text-text-primary font-semibold">Сеанс: </span>
          <span class="text-text-secondary">18:00</span>
        </div>
        <div>
          <span class="text-text-primary font-semibold">Гостей: </span>
          <span class="text-text-secondary">2 гостя</span>
        </div>
        <div>
          <span class="text-text-primary font-semibold">К оплате: </span>
          <span class="text-text-secondary">3350 ₽</span>
        </div>
      </div>

      
    </div>

    <div class="flex flex-col gap-2 mb-6">
      <!-- <label class="text-text-primary font-semibold" for="promocode">Введите промокод</label> -->
      <InputText id="promocode" placeholder="Введите промокод" />
      <Button label="Применить промокод" />
    </div>

    <div>
      <span class="text-text-primary font-semibold">Применена скидка: </span>
      <span class="text-text-secondary">540 ₽</span>
    </div>

    <div class="mb-4">
      <span class="text-text-primary font-semibold">Итого: </span>
      <span class="text-text-secondary">14150 ₽</span>
    </div>

    <Button class="w-full" label="Оплатить" />
  </div>
</template>