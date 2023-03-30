window.onload = () =>{
    createOrder();
}


function createOrder() {
    const form = document.querySelector('#create-order-form');
    form.addEventListener("submit", async (e) =>{
        e.preventDefault();
          const pick_up_date = form.date.value;
          const pick_up_time = form.time.value;
          const pick_up_district = form.pickUpDistrict.value;
          const pick_up_address =
            form.pickUpRoom.value +
            ", " +
            form.pickUpFloor.value +
            ", " +
            form.pickUpBuilding.value +
            ", " +
            form.pickUpStreet.value;
          // const pick_up_coordinates =form.pick_up_coordinates
          const deliver_district = form.deliver_district.value;
          const deliver_address =
            form.deliverRoom.value +
            ", " +
            form.deliverFloor.value +
            ", " +
            form.deliverBuilding.value +
            ", " +
            form.deliverStreet.value;
          // const deliver_coordinates =form.deliver_coordinates
          const receiver_name = form.receiverName.value;
          const receiver_contact = form.receiver_contact.value;
          const animals_id = form.animalsName.value;
          const animals_amount = form.animals_amount.value;
          const remarks = form.remarks.value;


    })
}