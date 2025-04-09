import { Card, CardBody, CardHeader, Heading } from "@chakra-ui/react"
import styles from '../../styles/Component Styles/InfoCard.module.css'

/**
 * A component that renders an info card with a title and a list of items for the services page.
 * @param {Object} props - The props object.
 * @param {string} props.title - The title of the info card.
 * @param {string[]} props.itemArray - The array of items to display in the list.
 * @param {string} [props.width] - The maximum width of the card. Defaults to '100%'.
 * @param {string} [props.height] - The minimum height of the card. Defaults to 'auto'.
 * @returns {JSX.Element} - The JSX element representing the InfoCard.
 */
const InfoCard = (props) => {
  const itemArray = props.itemArray

  return (
    <Card maxWidth={props.width} minHeight={props.height} margin={5} variant={"outline"}>
      <CardHeader>
        <Heading>{props.title}</Heading>
      </CardHeader>
      <CardBody>
        <ul className={styles.list}>
          {itemArray?.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </CardBody>
    </Card>
  )
}

export default InfoCard
