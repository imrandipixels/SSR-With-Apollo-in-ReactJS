import { ApolloClient, InMemoryCache , gql} from '@apollo/client';

const client = new ApolloClient({
  uri: 'http://localhost:8000/',
  cache: new InMemoryCache()
});


client
  .query({
    query: gql`
      query {
        students{
          name
        }
      }
    `
  })
  .then(result => console.log(result));

export default client;