<script lang="ts" setup>
import { ref, onMounted, PropType, inject } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useGroupOrdersStore } from '../../store/groupOrders';
import { useBookingStore } from '../../store/booking';
import { useECommerceStore } from '../../store/eCommerce';
import { useScheduleStore } from '../../store/schedule';
import { useTariffsStore } from '../../store/tariffs';
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
const showDelAdultButton = ref(true);
const showDelChildrenButton = ref(true);
const showSplitAndDelAdultButton = ref(false);
const showSplitAndDelChildrenButton = ref(false);
const showSplittingGroup = ref(false);
const isLimitAdults = ref(false);
const isGroupLimitAdults = ref(false);
const isLimitChildren = ref(false);

onMounted(()=>{
  // const adults = props.orderByTariff.getCountAdults();
  const children = props.orderByTariff.getCountChildren();

  if (!children) isLimitChildren.value = true;

});

const emits = defineEmits(['hide']);
const hide = () => {
  emits('hide');
}

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

const delECommerse = (tariff: ITariff, date: string, time: string) => {
  const products: IECommerceProduct[] = [];
  const product: IECommerceProduct = {
    id: tariff.id,
    category: 'Термальные источники',
    name: tariff.adminTitle,
    price: tariff.price,
    quantity: 1
  }
  products.push(product)
  eCommerce.delProducts(products);

    // Отправка цели Яндекс.Метрики.
    if(typeof (window as any).sendYandexGoal === 'function'){
    (window as any).sendYandexGoal('delTariffToCart', {
      tariff: tariff.adminTitle,
      price: tariff.price,
      day: date,
      time: time
    });
  }
}

const clickDelAdult = () => {
  const adults = props.orderByTariff.getCountAdults();
  const children = props.orderByTariff.getCountChildren();

  if (children > (adults - 1) * 2){
    showDelAdultButton.value = false;
    showDelChildrenButton.value = false;
    if(props.orderByTariff.tariff.type === "group"){
      isGroupLimitAdults.value = true;
    } else {
      isLimitAdults.value = true;
    }
    return;
  }

  //Случаи когда кол-во взрослых не выходит за лимит
  if(props.orderByTariff.tariff.type === "group"){
    showSplittingGroup.value = true;
    showDelAdultButton.value = false;
    showDelChildrenButton.value = false;
    showSplitAndDelAdultButton.value = true;
  } else {
    delAdult();
    showPopup.value = false;
  }
};

const delAdult = () => {
  const orders: IOrder[] = props.orderByTariff.orders;
  const order: IOrder | undefined = orders.find((el: IOrder) => el.isAdult);
  if(order){

    const event: IEvent = {
      type: 'change-cart'
    };
    eventBus.publish(event);

    bookingStore.orders = bookingStore.orders.filter((el: IOrder) => el.uid !== order.uid);
    delECommerse(props.orderByTariff.tariff, props.orderByTariff.date, props.orderByTariff.time);

    const takePlace: ITakePlace = {
      appointmentId: order.appointmentId,
      isUnlimited: props.orderByTariff.tariff.type === "unlimited" ? true : false,
      count: 1
    };
    scheduleStore.freeUpSeat(takePlace);
  }
}

const delChildren = (count: number = 1) => {
  const orders: IOrder[] = props.orderByTariff.orders.filter((el: IOrder) => !el.isAdult);
  const deleteOrders = orders.slice(0, count);
  const uids = deleteOrders.map((order: IOrder) => order.uid);

  const event: IEvent = {
      type: 'change-cart'
    };
  eventBus.publish(event);

  bookingStore.orders = bookingStore.orders.filter((el: IOrder) => !uids.some(uid => uid === el.uid));
  if(deleteOrders.length){
    const firstOrder = deleteOrders[0];
    const takePlace: ITakePlace = {
      appointmentId: firstOrder.appointmentId,
      isUnlimited: props.orderByTariff.tariff.type === "unlimited" ? true : false,
      count: deleteOrders.length
    };
    scheduleStore.freeUpSeat(takePlace);
  }
}

const clickDelChildren = () => {
  if(
    props.orderByTariff.tariff.type === "group"
    &&
    props.orderByTariff.getCountChildren() <= props.orderByTariff.tariff.countChildren
  ){
    showSplittingGroup.value = true;
    showDelAdultButton.value = false;
    showDelChildrenButton.value = false;
    showSplitAndDelChildrenButton.value = true;
  } else {
    delChildren();
    showPopup.value = false;
  }
};

const clickDelAdultWithChildren = () => {
  const adults = props.orderByTariff.getCountAdults();
  const children = props.orderByTariff.getCountChildren();

  let countDeleteChildren = children - (adults - 1) * 2;
  if(adults === 1) countDeleteChildren = children;

  delChildren(countDeleteChildren);
  delAdult();
  showPopup.value = false;
};

const splitTariff = async () => {
  const orders: IOrder[] = props.orderByTariff.orders;
  const tariffStore = useTariffsStore();

  const dateTime = `${props.orderByTariff.date}T${props.orderByTariff.time}`;
  const tariffs: ITariff[] = await tariffStore.getFilteredTariffs(dateTime);

  const availableTariff: ITariff | undefined = tariffs.find((tariff: ITariff) => tariff.type === 'base');

  if(availableTariff) {
    orders.forEach((order: IOrder) => {
      order.tariffId = availableTariff.id;
    });

    let detail = `Произведено разбитие группового тарифа".`
    detail += ` Новый тариф - "${availableTariff.title}".`;
    if(props.orderByTariff.getCountChildren()){
      detail += ` Оплата за детский тариф(ы) (6-14 лет) будет на месте с представлением документа подтверждающего возраст.`
    }

    toast.add(
      {
        severity: 'success',
        summary: 'Применение тарифа',
        detail: detail
      }
    );
  }
};

const confirmSplitAndDelAdult = async () => {
  splitTariff();
  delAdult();
  checkAndGroup();
  showPopup.value = false;
}

const confirmSplitAndDelChildren = () => {
  splitTariff();
  delChildren();
  showPopup.value = false;
}

const confirmSplitAndDelAdultWithChildren = () => {
  clickDelAdultWithChildren();
  splitTariff();
  checkAndGroup();
  showPopup.value = false;
}


</script>

<template>
  <Dialog
    v-model:visible="showPopup"
    modal
    style="min-width: 24rem;"
    header="Удаление посещения"
    @hide="hide()"
  >

    <div
      v-if="isLimitAdults || isGroupLimitAdults"
      class="mb-4 text-red-700"
    >
      На один "взрослый тариф" возможно добавить не более двух детских
      тарифов.
    </div>

    <div
      v-if="showSplittingGroup"
      class="mb-6"
    >
      Вы подтверждаете разбитие группового тарифа?
    </div>

    <div
      v-if="showSplittingGroup && orderByTariff.tariff.countChildren > 1"
      class="mb-6"
    >
      Оплата за посещение ребенка (6-14 лет) будет на месте с
      представлением документа подтверждающего возраст.
    </div>

    <div
      v-if="showSplittingGroup && orderByTariff.tariff.countChildren == 1"
      class="mb-6"
    >
      Оплата за посещение ребенка (6-14 лет) возможна на месте с
      представлением документа подтверждающего возраст.
    </div>

    <div
      v-if="isGroupLimitAdults"
      class="mb-6"
    >
      Вы подтверждаете разбитие тарифа и удаление детских посещений сверх допустимой нормы?
    </div>

    <div
      v-if="isLimitAdults"
      class="mb-6"
    >
      Вы подтверждаете удаление детских тарифов сверх допустимой нормы?
    </div>

    <div class="flex gap-6 justify-end">
      <Button
        v-if="showDelAdultButton"
        label="Удалить взрослый тариф"
        @click="clickDelAdult"
        raised
      />
      <Button
        v-if="showDelChildrenButton"
        label="Удалить детский тариф"
        :disabled="isLimitChildren"
        @click="clickDelChildren"
        raised
      />
      <Button
        v-if="isLimitAdults"
        label="Удалить"
        :disabled="isLimitChildren"
        @click="clickDelAdultWithChildren"
        raised
      />
      <Button
        v-if="showSplittingGroup && showSplitAndDelAdultButton"
        label="Подтверждаю"
        @click="confirmSplitAndDelAdult"
        raised
      />
      <Button
        v-if="isGroupLimitAdults"
        label="Подтверждаю"
        @click="confirmSplitAndDelAdultWithChildren"
        raised
      />
      <Button
        v-if="showSplittingGroup && showSplitAndDelChildrenButton"
        label="Подтверждаю"
        @click="confirmSplitAndDelChildren"
        raised
      />
      <Button
        v-if="showSplittingGroup"
        label="Отмена"
        @click="showPopup=false"
        raised
      />
    </div>

  </Dialog>
</template>