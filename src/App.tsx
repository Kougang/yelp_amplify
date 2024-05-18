import React, { useEffect, useReducer } from "react";
import "./App.css";
import { Button, Col, Container, Form, Row, Table } from "react-bootstrap";
import { withAuthenticator } from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { Amplify, API, graphqlOperation } from "aws-amplify";

import awsConfig from "./aws-exports";
import { createRestaurant } from "./graphql/mutations";
import { listRestaurants } from "./graphql/queries";
import { onCreateRestaurant } from "./graphql/subscriptions";

import { Observable } from "zen-observable-ts"; // Utilisez zen-observable-ts

Amplify.configure(awsConfig);

type Restaurant = {
  name: string;
  description: string;
  city: string;
};
type AppState = {
  restaurants: Restaurant[];
  formData: Restaurant;
};

type Action =
  | {
      type: "QUERY";
      payload: Restaurant[];
    }
  | {
      type: "SUBSCRIPTION";
      payload: Restaurant;
    }
  | {
      type: "SET_FORM_DATA";
      payload: { [field: string]: string };
    };
type SubscriptionEvent<D> = {
  value: {
    data: D;
  };
};

const initialState: AppState = {
  restaurants: [],
  formData: {
    name: "",
    city: "",
    description: "",
  },
};

const reducer = (state: AppState, action: Action) => {
  switch (action.type) {
    case "QUERY":
      return { ...state, restaurants: action.payload };
    case "SUBSCRIPTION":
      return { ...state, restaurants: [...state.restaurants, action.payload] };
    case "SET_FORM_DATA":
      return { ...state, formData: { ...state.formData, ...action.payload } };
    default:
      return state;
  }
};

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    getRestaurantList();

    const subscription = API.graphql(
      graphqlOperation(onCreateRestaurant)
    ) as Observable<SubscriptionEvent<{ onCreateRestaurant: Restaurant }>>;

    const subscriptionObservable = subscription.subscribe({
      next: (eventData) => {
        const payload = eventData.value.data.onCreateRestaurant;
        dispatch({ type: "SUBSCRIPTION", payload });
      },
    });

    return () => subscriptionObservable.unsubscribe();
  }, []);

  const getRestaurantList = async () => {
    try {
      const result = (await API.graphql(graphqlOperation(listRestaurants))) as {
        data: { listRestaurants: { items: Restaurant[] } };
      };
      dispatch({
        type: "QUERY",
        payload: result.data.listRestaurants.items,
      });
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  const createNewRestaurant = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    const { name, description, city } = state.formData;
    const restaurant = { name, description, city };
    try {
      await API.graphql(
        graphqlOperation(createRestaurant, { input: restaurant })
      );
      // Optionally clear the form or provide feedback to the user here
    } catch (error) {
      console.error("Error creating restaurant:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    dispatch({
      type: "SET_FORM_DATA",
      payload: { [e.target.name]: e.target.value },
    });

  return (
    <div className="App">
      <Container>
        <Row className="mt-3">
          <Col md={4}>
            <Form>
              <Form.Group controlId="formDataName">
                <Form.Control
                  onChange={handleChange}
                  type="text"
                  name="name"
                  placeholder="Name"
                />
              </Form.Group>
              <Form.Group controlId="formDataDescription">
                <Form.Control
                  onChange={handleChange}
                  type="text"
                  name="description"
                  placeholder="Description"
                />
              </Form.Group>
              <Form.Group controlId="formDataCity">
                <Form.Control
                  onChange={handleChange}
                  type="text"
                  name="city"
                  placeholder="City"
                />
              </Form.Group>
              <Button onClick={createNewRestaurant} className="float-left">
                Add New Restaurant
              </Button>
            </Form>
          </Col>
        </Row>

        {state.restaurants.length ? (
          <Row className="my-3">
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>City</th>
                  </tr>
                </thead>
                <tbody>
                  {state.restaurants.map((restaurant, index) => (
                    <tr key={`restaurant-${index}`}>
                      <td>{index + 1}</td>
                      <td>{restaurant.name}</td>
                      <td>{restaurant.description}</td>
                      <td>{restaurant.city}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Col>
          </Row>
        ) : null}
      </Container>
    </div>
  );
};

export default withAuthenticator(App);
