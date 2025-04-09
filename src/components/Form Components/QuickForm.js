import { useState } from 'react'
import {
  Text,
  Input,
  Button,
  Flex,
  FormLabel,
  FormControl,
  FormErrorMessage,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast
} from '@chakra-ui/react'
import { sendContactForm } from '@/lib/api'
import buttonStyles from '../../styles/Component Styles/FlowButton.module.css'


//An object containing initial values for the form fields
const initValues = {
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  carMake: '',
  carModel: '',
  desiredDate: '',
}

//An object containing the initial state for the form
const initState = { values: initValues }

/**
 * A form component that displays input fields for users to submit a contact request. (Opens as a modal dialog box)
 * @component
 * @param {Object} props - The props object
 * @param {boolean} isOpen - A boolean indicating whether the modal is open or not
 * @param {function} onClose - A function that will close the modal
 * @returns {JSX.Element} - Returns a JSX.Element containing the form fields
 */
const Form = ({ isOpen, onClose }) => {
  //The state of the form
  const [formState, setFormState] = useState(initState)
  //Object that is updated if an input has been touched or not
  const [touched, setTouched] = useState({})
  const toast = useToast()
  const { values, isLoading, error } = formState

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
      await sendContactForm(values)
      /**
       * Setting form to it's initial state (effectively clears the form, sets 'isLoading' parameter to false, 
       * 'error' parameter to empty, and sets form inputs to having not been touched)
      */
      setTouched({})
      setFormState(initState)
      //Close the modal
      onClose()
      //Toast message that message was sent succesfully
      toast({
        title: 'Submission Succesful',
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Изпрати Заявка</ModalHeader>
        <ModalCloseButton />
        { //If there is an error message, error message will be displayed above the form inputs
          error && (
            <Flex justifyContent='center'>
              <Text color='red.300' my={4} fontSize='xl'>
                {error}
              </Text>
            </Flex>
          )}
        <ModalBody>
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
              <FormLabel>Име</FormLabel>
              <Input
                type='text'
                name='firstName'
                value={values.firstName}
                onChange={handleInputChange}
                errorBorderColor='red.300'
                onBlur={onBlur}
                width='300px' />
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
            <Flex flexDirection='column' justifyContent='center' alignItems='center'>
              <FormLabel>Фамилия</FormLabel>
              <Input
                type='text'
                name='lastName'
                value={values.lastName}
                onChange={handleInputChange}
                errorBorderColor='red.300'
                onBlur={onBlur}
                width='300px' />
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
              touched.email && !values.email
            }
            mb={5}>
            <Flex flexDirection='column' justifyContent='center' alignItems='center'>
              <FormLabel>Имейл</FormLabel>
              <Input
                type='email'
                name='email'
                value={values.email}
                onChange={handleInputChange}
                errorBorderColor='red.300'
                onBlur={onBlur}
                width='300px' />
              <FormErrorMessage>Задължително</FormErrorMessage>
            </Flex>
          </FormControl>
          <FormControl mb={5}>
            <Flex flexDirection='column' justifyContent='center' alignItems='center'>
              <FormLabel>Тел. Номер</FormLabel>
              <Input
                type='tel'
                name='phoneNumber'
                value={values.phoneNumber}
                onChange={handleInputChange}
                width='300px' />
            </Flex>
          </FormControl>
          <FormControl mb={5}>
            <Flex flexDirection='column' justifyContent='center' alignItems='center'>
              <FormLabel>Марка</FormLabel>
              <Input
                type='text'
                name='carMake'
                value={values.carMake}
                onChange={handleInputChange}
                width='300px' />
            </Flex>
          </FormControl>
          <FormControl mb={5}>
            <Flex flexDirection='column' justifyContent='center' alignItems='center'>
              <FormLabel>Модел</FormLabel>
              <Input
                type='text'
                name='carModel'
                value={values.carModel}
                onChange={handleInputChange}
                width='300px' />
            </Flex>
          </FormControl>
          <FormControl mb={5}>
            <Flex flexDirection='column' justifyContent='center' alignItems='center'>
              <FormLabel>Желана Дата</FormLabel>
              <Input
                type='date'
                name='desiredDate'
                value={values.desiredDate}
                onChange={handleInputChange}
                width='300px' />
            </Flex>
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            className={buttonStyles.button}
            isLoading={isLoading}
            onClick={onSubmit}
          >Запази</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}



export default Form