import { useQuery, gql } from "@apollo/client"


const GET_ACTIVE_ITEMS = gql`
{
  activeItems(first: 5, where:{buyer:"0x0000000000000000000000000000000000000000"}) {
    id
    buyer
    seller
    nftAddress
    tokenId
    price
  } 
}
`

export default function GraphQLExample() {
    const {loading, error, data } = useQuery(GET_ACTIVE_ITEMS)
  return (
    <div>graphQLExample: {console.log(data)}</div>
  )
}
