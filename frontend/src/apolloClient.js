import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const isProduction = window.location.hostname !== 'localhost';

const graphqlUri = isProduction 
  ? 'https://tesk-task.xo.je/backend/public/index.php' 
  : 'http://localhost:8000/index.php';


const link = createHttpLink({
  uri: graphqlUri,
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

export default client;