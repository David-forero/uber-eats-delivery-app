import { createContext, useEffect, useState, useContext } from "react";
import { Auth, DataStore } from "aws-amplify";
import { Courier, Order, User, OrderDish } from "../models";
import { useAuthContext } from "./AuthContext";
import { set } from "react-native-reanimated";

const OrderContext = createContext({});

const OrderContextProvider = ({ children }) => {
  const { dbCourier } = useAuthContext();
  const [order, setOrder] = useState();
  const [user, setUser] = useState();
  const [dishes, setDishes] = useState();

  const fetchOrder = async (id) => {
    if (!id) {
      setOrder(null);
      return;
    }

    let fetchedOrder = await DataStore.query(Order, id);
    setOrder(fetchedOrder);
    console.log('order 🍔',fetchedOrder);    

    DataStore.query(User, fetchedOrder.userID).then(setUser);
console.log(fetchedOrder.id);
    DataStore.query(OrderDish, (od) => od.orderID("eq", fetchedOrder.id)).then(
      res => console.log('dishes -->',res)
    );
  };

  useEffect(() => {
    if (!order) {
      return;
    }

    const subscription =  DataStore.observe(Order, order.id).subscribe(({opType, element}) => {
      if (opType === "UPDATE") {
        // setOrder((existingOrder) => ({...existingOrder, ...element}));
        fetchOrder(order.id)
      }
    })

    return () => subscription.unsubscribe();
  }, [order?.id])
  

  const acceptOrder = async () => {
    // update the order, and change status, and assign the courier
    const updatedOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "ACCEPTED";
      })
    );

    setOrder(updatedOrder);
  };

  const pickUpOrder = async () => {
    // update the order, and change status, and assign the courier
    const updateOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "PICKED_UP";
      })
    );

    setOrder(updateOrder);
  };

  const completeOrder = async () => {
    // update the order, and change status, and assign the courier
    const updateOrder = await DataStore.save(
      Order.copyOf(order, (updated) => {
        updated.status = "COMPLETED";
      })
    );
    setOrder(updateOrder);
  };

  return (
    <OrderContext.Provider
      value={{
        acceptOrder,
        order,
        user,
        dishes,
        fetchOrder,
        pickUpOrder,
        completeOrder,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export default OrderContextProvider;

export const useOrderContext = () => useContext(OrderContext);
