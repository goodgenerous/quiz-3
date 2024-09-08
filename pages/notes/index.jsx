import dynamic from "next/dynamic";
import {
  Flex,
  Grid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Button,
  ButtonGroup,
  Text,
  GridItem,
  useToast,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  ModalContent,
  FormControl,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { mutate } from "swr";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function Notes({ data }) {
  const [currentId, setCurrentId] = useState(null);
  const [modalType, setModalType] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();
  const toast = useToast();
  const [dataAPI, setDataAPI] = useState({
    title: "",
    description: "",
  });
  const [notesData, setNotesData] = useState({
    title: "",
    description: "",
  });

  const handleEvent = (event) => {
    event.preventDefault();
    setNotesData({ ...notesData, [event.target.name]: event.target.value });
  };

  const handleEditEvent = (event) => {
    event.preventDefault();
    setDataAPI({ ...dataAPI, [event.target.name]: event.target.value });
    console.log(dataAPI);
  };

  useEffect(() => {
    async function fetchingData() {
      const res = await fetch(`/api/notes/${currentId}`);
      const listNotes = await res.json();
      setDataAPI(listNotes.data);
    }
    fetchingData();
  }, [currentId]);

  const handleCurrentId = (id, type) => {
    setCurrentId(id);
    setModalType(type);
    onOpen();
  };

  const handleSubmitEdit = async (id) => {
    try {
      const url = `/api/notes/update/${id}`;
      const response = await mutate(
        url,
        async () => {
          const result = await fetch(url, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...dataAPI }),
          });
          return await result.json();
        },
        { revalidate: true }
      );
      console.log(response);
      toast({
        title: "Data Success Edited",
        position: "top",
        variant: "top-accent",
        status: "success",
        isClosable: true,
      });
      router.push("/notes");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = async () => {
    try {
      const url = `/api/notes`;
      const response = await mutate(
        url,
        async () => {
          const result = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(notesData),
          });
          if (!result.ok) return result.json();
        },
        { revalidate: true }
      );
      console.log(response);
      toast({
        title: "Data Success Added",
        position: "top",
        variant: "top-accent",
        status: "success",
        isClosable: true,
      });
      router.push("/notes");
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const url = `/api/notes/delete/${id}`;
      await mutate(url, async () => {
        const result = await fetch(url, { method: "DELETE" });
        if (!result.ok)
          throw new Error(`Error deleting note: ${result.status}`);
        return result.json();
      });
      toast({
        title: "Data Successfully Deleted",
        position: "top",
        variant: "top-accent",
        status: "warning",
        isClosable: true,
      });
      router.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const ModalDelete = () => (
    <Modal
      isCentered
      isOpen={isOpen && modalType === "DELETE"}
      onClose={onClose}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Do you want to delete this data? </ModalHeader>{" "}
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel> Title </FormLabel>
            <Input
              isDisabled
              type="text"
              name="title"
              value={dataAPI && dataAPI.title}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel> Description </FormLabel>
            <Textarea
              isDisabled
              type="text"
              name="description"
              value={dataAPI && dataAPI.description}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={() => handleDelete(currentId)}>
            Delete
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ModalEdit = () => (
    <Modal
      isCentered
      isOpen={isOpen && modalType === "EDIT"}
      onClose={onClose}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Edit Data </ModalHeader> <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel> Title </FormLabel>
            <Input
              type="text"
              name="title"
              value={dataAPI && dataAPI.title}
              onChange={handleEditEvent}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel> Description </FormLabel>
            <Textarea
              type="text"
              name="description"
              value={dataAPI && dataAPI.description}
              onChange={handleEditEvent}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              handleSubmitEdit(currentId);
              onClose();
            }}
            colorScheme="blue"
            mr={3}
          >
            Save
          </Button>
          <Button onClick={onClose}> Cancel </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  const ModalAdd = () => (
    <Modal
      closeOnEsc={true}
      isCentered
      isOpen={isOpen && modalType === "ADD"}
      onClose={onClose}
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader> Add Data </ModalHeader> <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel> Title </FormLabel>{" "}
            <Input
              placeholder="Title"
              name="title"
              value={notesData.title}
              onChange={handleEvent}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel> Description </FormLabel>
            <Textarea
              placeholder="Description"
              name="description"
              value={notesData.description}
              onChange={handleEvent}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button
            onClick={() => {
              handleSubmit();
              onClose();
            }}
            colorScheme="green"
            mr={3}
          >
            Submit
          </Button>
          <Button onClick={onClose}> Cancel </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );

  return (
    <LayoutComponent
      metaTitle="List Notes"
      metaDescription="Ini merupakan halaman list notes"
    >
      <Flex justify="center" p={4}>
        <Button
          colorScheme="green"
          onClick={() => {
            setModalType("ADD");
            onOpen();
          }}
        >
          Add Data
        </Button>
      </Flex>
      <Flex justify="center" p={4}>
        <Grid templateColumns="repeat(3, 1fr)" gap={5}>
          {data &&
            data.data.map((item) => (
              <GridItem key={item.id}>
                <Card maxW="sm">
                  <CardHeader>
                    <Heading size="md"> {item.title} </Heading>
                  </CardHeader>
                  <CardBody>
                    <Text> {item.description} </Text>
                  </CardBody>
                  <CardFooter>
                    <ButtonGroup spacing="2">
                      <Button
                        onClick={() => handleCurrentId(item.id, "EDIT")}
                        variant="solid"
                        colorScheme="blue"
                      >
                        Edit
                      </Button>
                      <Button
                        onClick={() => handleCurrentId(item.id, "DELETE")}
                        variant="solid"
                        colorScheme="red"
                      >
                        Delete
                      </Button>
                      <Button
                        onClick={() => router.push(`/notes/${item.id}`)}
                        variant="solid"
                        colorScheme="yellow"
                      >
                        Details
                      </Button>
                    </ButtonGroup>
                  </CardFooter>
                </Card>
              </GridItem>
            ))}
        </Grid>
        {ModalDelete()}
        {ModalEdit()}
        {ModalAdd()}
      </Flex>
    </LayoutComponent>
  );
}

export async function getServerSideProps() {
  const res = await fetch("http://localhost:3000/api/notes");
  const data = await res.json();
  return { props: { data } };
}
