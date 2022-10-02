const emptyOr = (input: string | boolean): string =>
  !!input && typeof input === 'string' ? input : '';

export default emptyOr;
