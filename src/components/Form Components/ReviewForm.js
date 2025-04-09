import { useState } from "react"
import { useRouter } from "next/router"
import {
  Text,
  Textarea,
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
} from "@chakra-ui/react"
import { sendReviewForm } from "@/lib/api.js"
import buttonStyles from '../../styles/Component Styles/FlowButton.module.css'

//An object containing initial values for the form fields
const initValues = {
  firstName: '',
  lastName: '',
  reviewText: '',
}

//An object containing the initial state for the form
const initState = { values: initValues }

/**
 * A form component that allows a user to submit a review. (Opens as a modal dialog box)
 * @component
 * @param {Object} props - The props object
 * @param {boolean} isOpen - Whether the modal is open or not
 * @param {function} onClose - A function to close the modal
 * @returns {JSX.Element} - A JSX element representing the review form
*/
const ReviewForm = ({ isOpen, onClose }) => {
  //The state of the form
  const [formState, setFormState] = useState(initState)
  //Object that is updated if an input has been touched or not
  const [touched, setTouched] = useState({})
  const { values, isLoading, error } = formState
  const router = useRouter()
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
      await sendReviewForm(values)
      /**
       * Setting form to it's initial state (effectively clears the form, sets 'isLoading' parameter to false, 
       * 'error' parameter to empty, and sets form inputs to having not been touched)
      */
      setTouched({})
      setFormState(initState)
      //Close the modal
      onClose()
      //"Temporary" solution to displaying new data on submission of review (refreshes page)
      router.reload()
      //Toast message that review was succesfully stored in database
      toast({
        title: 'Thank you for your review!',
        status: 'success',
        duration: 2000,
        position: 'top'
      })
    } catch (error) {
      //Does not clear form or close modal, sets 'isLoading' to false, and sets 'error' to the error message returned by the API
      setFormState(prev => ({
        ...prev,
        isLoading: false,
        error: error.message
      }))
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Submit Review</ModalHeader>
        <ModalCloseButton />
        {//If there is an error message, error message will be displayed above the form inputs
          error &&
          <Flex justifyContent='center'>
            <Text color='red.300' my={4} fontSize='x1'>
              {error}
            </Text>
          </Flex>}
        <ModalBody>
          <Flex gap={3}>
            <FormControl
              isRequired
              isInvalid={
                /**
                 * If the input has been touched and there is no data inside of it, sets the error 
                 * border color to red and displays form error message
                 */
                touched.firstName && !values.firstName
              }>
              <Flex flexDirection='column' alignItems='center'>
                <FormLabel>First Name</FormLabel>
                <Input
                  type='text'
                  name='firstName'
                  value={values.firstName}
                  onChange={handleInputChange}
                  errorBorderColor='red.300'
                  onBlur={onBlur}
                />
                <FormErrorMessage>Required</FormErrorMessage>
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
              }>
              <Flex flexDirection='column' alignItems='center'>
                <FormLabel>Last Name</FormLabel>
                <Input
                  type="text"
                  name='lastName'
                  value={values.lastName}
                  onChange={handleInputChange}
                  errorBorderColor='red.300'
                  onBlur={onBlur}
                />
                <FormErrorMessage>Required</FormErrorMessage>
              </Flex>
            </FormControl>
          </Flex>
          <Flex flexDirection='column' alignItems='center'>
            <FormControl
              isRequired
              isInvalid={
                /**
                 * If the input has been touched and there is no data inside of it, sets the error 
                 * border color to red and displays form error message
                 */
                touched.reviewText && !values.reviewText
              }
              mt={3}
            >
              <Textarea
                name='reviewText'
                value={values.reviewText}
                onChange={handleInputChange}
                placeholder="Please enter your review here"
                errorBorderColor='red.300'
                onBlur={onBlur}
              >
              </Textarea>
              <Flex flexDirection='column' alignItems='center'>
                <FormErrorMessage>Required</FormErrorMessage>
              </Flex>
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            className={buttonStyles.button}
            isLoading={isLoading}
            onClick={onSubmit}
          >Submit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ReviewForm