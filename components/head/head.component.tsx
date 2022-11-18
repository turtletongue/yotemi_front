interface HeadProps {
  title: string;
}

const Head = ({ title }: HeadProps) => {
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </>
  );
};

export default Head;
