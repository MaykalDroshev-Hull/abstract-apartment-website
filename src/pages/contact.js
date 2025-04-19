import { useState } from "react"
import Meta from "@/components/Page Components/Meta"
import PageTitle from "@/components/Page Components/PageTitle"
import { Text, Button, Flex, FormControl, FormErrorMessage, FormLabel, Input, Select, Stack, Textarea, useToast, background } from "@chakra-ui/react"
import { sendLongContactForm } from "@/lib/api"
import styles from '../styles/Page Styles/Contact.module.css'

//An object containing initial values for the form fields
const initValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  carMake: '',
  carModel: '',
  typeOfDetail: '',
  additionalDetails: '',
  desiredDate: '',
}

//An object containing the initial state for the form
const initState = { values: initValues }

/**
 * A functional component that displays a contact form and allows the user to submit information for handling by the API
 * @returns {JSX.Element} The Contact component
 */
const contact = () => {
  //The state of the form
  const [formState, setFormState] = useState(initState)
  //Object that is updated if an input has been touched or not
  const [touched, setTouched] = useState({})
  const { values, isLoading, error } = formState
  const toast = useToast()

  //A function that updates the state of the form when an input field is blurred
  const onBlur = ({ target }) => setTouched(prev => ({
    ...prev,
    [target.name]: true,
  }))

  //A function that updates the state of the form when an input field value is changed
  const handleInputChange = ({ target }) =>
    setFormState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [target.name]: target.value,
      },
    }));

  //Function to submit the data to be handles by the API
  const onSubmit = async () => {
    setFormState(prev => ({
      ...prev,
      isLoading: true,
    }))
    try {
      //Redirect to API where data is further handled
      await sendLongContactForm(values)
      /**
       * Setting form to it's initial state (effectively clears the form, sets 'isLoading' parameter to false, 
       * 'error' parameter to empty, and sets form inputs to having not been touched)
      */
      setTouched({})
      setFormState(initState)
      //Toast message that message was sent succesfully
      toast({
        title: "Заявката е успешна!",
        status: 'success',
        duration: 2000,
        position: 'top'
      })
    } catch (error) {
      //Does not clear form or close modal, sets 'isLoading' to false, and sets 'error' to the error message returned by the API
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message,
      }))
    }
  }

  return (
    <>
      <Meta
        title="Контакти"
        description="Get in touch with .-M Auto Detailing and take the first step towards a cleaner, more polished car. Our experienced team is here to answer your questions and help you schedule an appointment for interior and exterior detailing, paint correction, ceramic coating, and more. Contact us today and experience the highest level of customer service and quality workmanship."
        keywords="auto detailing, car detailing, detailing services, paint correction, ceramic coating, interior detailing, exterior detailing, car care, auto appearance, auto restoration, contact us, schedule an appointment, get in touch, phone number, email address, location"
      />
      <PageTitle title="Контакти" />
      <div className={styles.content}>
        <div className={styles.contactDetails}>
          <p>
            Моля, изпратете заявка за среща и ние ще се свържем с вас възможно най-скоро!          </p>
        </div>
        <div className={styles.formContainer}>
          {error && (
            <Flex justifyContent='center'>
              <Text color='red.300' my={4} fontSize='xl'>
                {error}
              </Text>
            </Flex>
          )}
          <div className={styles.flexDisplay}>
            <Stack direction='row'>
              <FormControl
                isRequired
                isInvalid={
                  /**
                   * If the input has been touched and there is no data inside of it, sets the error 
                   * border color to red and displays form error message
                   */
                  touched.firstName && !values.firstName
                }
                mb={5}>
                <Flex flexDirection='column' alignItems='center'>
                  <FormLabel className={styles.Text}>Име</FormLabel>
                  <Input
                    type='text'
                    name='firstName'
                    className={styles.Text}
                    value={values.firstName}
                    onChange={handleInputChange}
                    errorBorderColor="red.300"
                    onBlur={onBlur}
                  />
                  <FormErrorMessage>Задължително</FormErrorMessage>
                </Flex>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  /**
                   * If the input has been touched and there is no data inside of it, sets the error 
                   * border color to red and displays form error message
                   */
                  touched.lastName && !values.lastName
                }
                mb={5}>
                <Flex flexDirection='column' alignItems='center'>
                  <FormLabel className={styles.Text}>Фамилия</FormLabel>
                  <Input
                    type='text'
                    name='lastName'
                    className={styles.Text}
                    value={values.lastName}
                    onChange={handleInputChange}
                    errorBorderColor="red.300"
                    onBlur={onBlur}
                  />
                  <FormErrorMessage>Задължително</FormErrorMessage>
                </Flex>
              </FormControl>
            </Stack>
          </div>
          <div className={styles.flexDisplay}>
            <Stack direction='row'>
              <FormControl
                isRequired
                isInvalid={
                  /**
                   * If the input has been touched and there is no data inside of it, sets the error 
                   * border color to red and displays form error message
                   */
                  touched.email && !values.email
                }
                mb={5}>
                <Flex flexDirection='column' alignItems='center'>
                  <FormLabel className={styles.Text}>Email</FormLabel>
                  <Input
                    type='email'
                    name='email'
                    className={styles.Text}
                    value={values.email}
                    onChange={handleInputChange}
                    errorBorderColor="red.300"
                    onBlur={onBlur}
                  />
                  <FormErrorMessage >Задължително</FormErrorMessage>
                </Flex>
              </FormControl>
              <FormControl
                isRequired
                isInvalid={
                  /**
                   * If the input has been touched and there is no data inside of it, sets the error 
                   * border color to red and displays form error message
                   */
                  touched.phoneNumber && !values.phoneNumber
                }
                mb={5}>
                <Flex flexDirection='column' alignItems='center'>
                  <FormLabel className={styles.Text}>Тел. Номер</FormLabel>
                  <Input
                    type='tel'
                    name='phoneNumber'
                    value={values.phoneNumber}
                    className={styles.Text}
                    onChange={handleInputChange}
                    errorBorderColor="red.300"
                    onBlur={onBlur}
                  />
                  <FormErrorMessage>Задължително</FormErrorMessage>
                </Flex>
              </FormControl>
            </Stack>
          </div>
          <div className={styles.flexDisplay}>
            <Stack direction='row'>
              <FormControl
                isRequired
                isInvalid={
                  /**
                   * If the input has been touched and there is no data inside of it, sets the error 
                   * border color to red and displays form error message
                   */
                  touched.carMake && !values.carMake
                }
                mb={5}>
                <Flex flexDirection='column' alignItems='center'>
                  <FormLabel className={styles.Text}>Марка</FormLabel>
                  <Input
                    type='text'
                    name='carMake'
                    className={styles.Text}
                    value={values.carMake}
                    onChange={handleInputChange}
                    errorBorderColor="red.300"
                    onBlur={onBlur}
                  />
                  <FormErrorMessage>Задължително</FormErrorMessage>
                </Flex>
              </FormControl >
              <FormControl
                isRequired
                isInvalid={
                  /**
                   * If the input has been touched and there is no data inside of it, sets the error 
                   * border color to red and displays form error message
                   */
                  touched.carModel && !values.carModel
                }
                mb={5}>
                <Flex flexDirection='column' alignItems='center'>
                  <FormLabel className={styles.Text}>Модел</FormLabel>
                  <Input
                    type='text'
                    name='carModel'
                    value={values.carModel}
                    className={styles.Text}
                    onChange={handleInputChange}
                    errorBorderColor="red.300"
                    onBlur={onBlur}
                  />
                  <FormErrorMessage>Задължително</FormErrorMessage>
                </Flex>
              </FormControl>
            </Stack>
          </div>
          <FormControl isRequired>
            <Flex flexDirection='column' alignItems='center'>
              <FormLabel className={styles.Text}>Услуга</FormLabel>
              <Select
                placeholder=" "
                name='typeOfDetail'
                value={values.typeOfDetail}
                className={styles.selectControl}
                onChange={handleInputChange}
                onBlur={onBlur}
                maxWidth='450px'
              >
                <option>Корекция на лаковото покритие</option>
                <option>Керамични покрития</option>
                <option>Поддръжка на керамично покритие</option>
                <option>One Step</option>
                <option>Измиване</option>
                <option>Корекция на фарове</option>
                <option>Корекция на стопове</option>
                <option>Детайлно почистване на интериор</option>
                <option>Почистване на стъкла + покритие</option>
                <option>Почистване на двигателен отсек</option>
                <option>Почистване на джанти</option>
                <option>Освежаване на спирачни апарати</option>
                <option>Пастиране / Полиране / Почистване на мотори, костюми и предпазни каски</option>
              </Select>
            </Flex>
          </FormControl>
          <FormControl mt={3} mb={5}>
            <Flex flexDirection='column' alignItems='center'>
              <FormLabel className={styles.Text}>Доп. Коментари</FormLabel>
              <Textarea
                type='text'
                name='additionalDetails'
                className={styles.Text}
                value={values.additionalDetails}
                onChange={handleInputChange}
                maxWidth='450px'
              />
            </Flex>
          </FormControl>
          <FormControl isRequired mb={5}>
            <Flex flexDirection='column' justifyContent='center' alignItems='center'>
              <FormLabel className={styles.Text}>Желана Дата</FormLabel>
              <Input
                type='date'
                name='desiredDate'
                value={values.desiredDate}
                className={styles.Text}
                onChange={handleInputChange}
                maxWidth='450px' />
            </Flex>
          </FormControl>
          <Flex>
            <Button style={{ backgroundColor: "black" }}
              className={styles.SubmitButton}
              isLoading={isLoading}
              onClick={onSubmit}
            >Запази</Button>
          </Flex>
        </div>
      </div>
    </>
  )
}

export default contact