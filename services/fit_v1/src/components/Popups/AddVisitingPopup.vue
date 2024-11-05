<script lang="ts" setup>
import { ref, onMounted, PropType, inject } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useBookingStore } from '../../store/booking';
import { useECommerceStore } from '../../store/eCommerce';
import { useGroupOrdersStore } from '../../store/groupOrders';
import { useScheduleStore } from '../../store/schedule';
import { useTariffsStore } from '../../store/tariffs';
import { v4 as uuidv4 } from 'uuid';
import { IECommerceProduct } from '../../types/IECommerce';
import IGroupingResult from '../../types/IGroupingResult';
import IOrderGroupByTariff from '../../types/IOrderGroupByTariff';
import IOrder from '../../types/IOrder';
import ITakePlace from '../../types/ITakePlace';
import ITariff from '../../types/ITariff';
import EventBus, {IEvent} from '../../utils/EventBus';

const bookingStore = useBookingStore();
const eCommerce = useECommerceStore();
const scheduleStore = useScheduleStore();
const toast = useToast();
const eventBus = inject('eventBus') as EventBus;

const props = defineProps({
  orderByTariff: {
    type: Object as PropType<IOrderGroupByTariff>,
    required: true,
  },
});

const showPopup = ref(true);
const showAddAdultButton = ref(true);
const showAddChildrenButton = ref(true);
const showChildrenBlocks = ref(false);
const showGroupLimit = ref(false);
const showChildrenTimeLimit = ref(false)
const isConsent = ref(false);
const isLimitAdults = ref(false);
const isLimitChildren = ref(false);

onMounted(()=>{
  const adults = props.orderByTariff.getCountAdults();
  const children = props.orderByTariff.getCountChildren();
  if(children >= adults * 2) isLimitChildren.value = true;
  if(props.orderByTariff.time > '16:59') isLimitChildren.value = true;
  if(props.orderByTariff.time > '15:59') showChildrenTimeLimit.value = true;
});

const emits = defineEmits(['hide']);
const hide = () => {
  emits('hide');
}

const clickAddAdult = async () => {
  if(props.orderByTariff.tariff.type === "group"){
    showGroupLimit.value = true;
    showAddAdultButton.value = false;
    showAddChildrenButton.value = false;
  } else if(props.orderByTariff.tariff.type === "base") {
    addAdult();
    checkAndGroup();

    showPopup.value = false;
  } else {
    addAdult();
    showPopup.value = false;
  }
};

const addECommerseAndGoals = (tariff: ITariff, date: string, time: string) => {
  const products: IECommerceProduct[] = [];
  const product: IECommerceProduct = {
    id: tariff.id,
    category: 'Термальные источники',
    name: tariff.adminTitle,
    price: tariff.price,
    quantity: 1
  }
  products.push(product)
  eCommerce.addProducts(products);

  // Отправка цели Яндекс.Метрики.
  if(typeof (window as any).sendYandexGoal === 'function'){
    (window as any).sendYandexGoal('addTariffToCart', {
      tariff: tariff.adminTitle,
      price: tariff.price,
      day: date,
      time: time
    });
  }
}

// TODO
const checkAndGroup = async () => {
  const groupOrdersStore = useGroupOrdersStore();
  const {isGrouping, groupTariff, childrenOrders}: IGroupingResult = await groupOrdersStore.checkAndGroup(props.orderByTariff);
  if(isGrouping && groupTariff){
    const event: IEvent = {
      type: 'change-cart'
    };
    eventBus.publish(event);

    let detail = `Применен групповой тариф - "${ groupTariff.title.trim() }".`
    if(childrenOrders.length === 1){
      detail += ' Детское посещение включено в стоимость тарифа.';
    }
    if(childrenOrders.length > 1){
      detail += ' Одно детское посещение включено в стоимость тарифа.';
    }

    toast.add(
      {
        severity: 'success',
        summary: 'Применение тарифа',
        detail: detail
      }
    );
  }
}

const clickAddAdultInTariffTypeGroup = () => {
  addAdultInTariffTypeGroup();
  showPopup.value = false;
};

const addAdult = () => {
  const orders: IOrder[] = props.orderByTariff.orders;
  const order: IOrder = {...orders[0]};
  order.isAdult = true;
  order.uid = uuidv4();

  const event: IEvent = {
      type: 'change-cart'
    };
    eventBus.publish(event);

  bookingStore.orders.push(order);

  addECommerseAndGoals(props.orderByTariff.tariff, props.orderByTariff.date, props.orderByTariff.time);

  const takePlace: ITakePlace = {
    appointmentId: order.appointmentId,
    isUnlimited: props.orderByTariff.tariff.type === "unlimited" ? true : false,
    count: 1
  };
  scheduleStore.takeSeat(takePlace);
};

const addAdultInTariffTypeGroup = async () => {
  const tariffStore = useTariffsStore();

  const dateTime = `${props.orderByTariff.date}T${props.orderByTariff.time}`;
  const tariffs: ITariff[] = await tariffStore.getFilteredTariffs(dateTime);

  const availableTariff: ITariff | undefined = tariffs.find((tariff: ITariff) => tariff.type === 'base');

  if(availableTariff){

    //Проверка на наличие заказа с найденным тарифом
    let order: IOrder | undefined = bookingStore.orders.find((el: IOrder) => el.tariffId === availableTariff.id);

    if(!order){

      const orders: IOrder[] = props.orderByTariff.orders;
      order = {...orders[0]};
      order.tariffId = availableTariff.id;
      order.tariffGroupId = uuidv4();
    }

    order.isAdult = true;
    order.uid = uuidv4();

    const event: IEvent = {
      type: 'change-cart'
    };
    eventBus.publish(event);

    bookingStore.orders.push(order);

    addECommerseAndGoals(availableTariff, props.orderByTariff.date, props.orderByTariff.time);

    const takePlace: ITakePlace = {
      appointmentId: order.appointmentId,
      isUnlimited: props.orderByTariff.tariff.type === "unlimited" ? true : false,
      count: 1
    };
    scheduleStore.takeSeat(takePlace);
  }
};

const clickAddChildren = () => {
  showAddAdultButton.value = false;
  showAddChildrenButton.value = false;
  showChildrenBlocks.value = true;
}

// TODO e-commerse children?
const addChildren = () => {
  const orders: IOrder[] = props.orderByTariff.orders;
  const order: IOrder = {...orders[0]};
  order.uid = uuidv4();
  order.isAdult = false;

  const event: IEvent = {
      type: 'change-cart'
    };
  eventBus.publish(event);

  bookingStore.orders.push(order);

  const takePlace: ITakePlace = {
    appointmentId: order.appointmentId,
    isUnlimited: props.orderByTariff.tariff.type === "unlimited" ? true : false,
    count: 1
  };
  scheduleStore.takeSeat(takePlace);

  checkAndGroup();

  showPopup.value = false;
}

</script>

<template>
  <Dialog
    v-model:visible="showPopup"
    modal
    style="min-width: 24rem;"
    header="Добавление посещения"
    @hide="hide()"
  >

    <div v-if="isLimitChildren" class="mb-4">
      На один "взрослый тариф" возможно добавить не более двух детских тарифов.
    </div>

    <div v-if="showChildrenTimeLimit">
      <div class="mb-4">
        Гости от 6 до 14 лет посещают термальную зону строго до 18:00.
      </div>
      <div class="mb-6">
        Гостям от 6 до 14 лет необходимо покинуть термальную зону в 18:00.
      </div>
    </div>


    <div v-if="showGroupLimit" class="mb-4">
      Будет добавлен "взрослый тариф на это же время."
    </div>

    <div class="flex gap-6">
      <Button
        v-if="showAddAdultButton && !isLimitAdults"
        label="Добавить взрослый тариф"
        @click="clickAddAdult"
      />
      <Button
        v-if="showAddChildrenButton"
        label="Добавить детский тариф"
        :disabled="isLimitChildren"
        @click="clickAddChildren"
      />
    </div>

    <div v-if="showChildrenBlocks" class="flex gap-4 items-center mb-4">
      <checkbox
        v-model="isConsent"
        :binary="true"
      />
      <p class="">
        Сопровождающий является законным представителем, или имеет
        письменное согласие от законного представителя на посещение
        ребенка.
      </p>
    </div>

    <div class="pb-6" v-if="showChildrenBlocks">
      Оплата за посещение ребенка (6-14 лет) будет на месте с
      представлением документа подтверждающего возраст.
    </div>

    <div v-if="showChildrenBlocks" class="flex justify-end gap-4">
      <Button
        label="Добавить"
        @click="addChildren"
        :disabled="!isConsent"
      />
    </div>
    <div v-if="showGroupLimit" class="flex justify-end gap-4">
      <Button
        label="Добавить"
        @click="clickAddAdultInTariffTypeGroup"
      />
    </div>


  </Dialog>
</template>