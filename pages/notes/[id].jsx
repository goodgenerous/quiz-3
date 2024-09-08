import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Card, Button, Flex } from "@chakra-ui/react";

const LayoutComponent = dynamic(() => import("@/layout"));

export default function DetailNotes({ notes }) {
  console.log("Data user => ", notes);
  const router = useRouter();
  return (
    <LayoutComponent
      metaTitle="Detail Notes"
      metaDescription="Ini merupakan halaman detail notes"
    >
      <Card margin={10}>
        <Flex
          direction="column"
          align="start"
          justify="center"
          padding={5}
          gap={4}
        >
          <Button colorScheme="red" onClick={() => router.back()}>
            Back
          </Button>
          <p className="text-lg font-bold"> Details Notes: </p>
          <p className="text-md"> Title: {notes.data.title} </p>
          <p className="text-md"> Description: {notes.data.title} </p>
        </Flex>
      </Card>
    </LayoutComponent>
  );
}

export async function getStaticPaths() {
  const res = await fetch("http://localhost:3000/api/notes");
  const notes = await res.json();
  const paths = notes.data.map((item) => ({
    params: { id: item.id.toString() },
  }));
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps(context) {
  const { id } = context.params;
  const res = await fetch(`http://localhost:3000/api/notes/${id}`);
  const notes = await res.json();
  return { props: { notes }, revalidate: 10 };
}
