import styles from '../../styles/Component Styles/PageTitle.module.css'

/**
 * A React component for rendering a page title.
 * @param {object} props - The props object.
 * @param {string} title - The title of the page.
 * @returns {JSX.Element} A React JSX element representing the page title.
 */
const PageTitle = ({ title }) => {
  return (
    <div className={styles.outerDiv}>
      <h1>{title}</h1>
    </div>
  )
}

export default PageTitle