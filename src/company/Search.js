import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

const Search = ({ onChange, onSubmit, value, children }) => {
  return (
    <form onSubmit={onSubmit}>
      <TextField
        label="Search field"
        type="search"
        margin="normal"
        value={value}
        onChange={onChange}
      />
      <Button color="primary">
        {children}
      </Button>
    </form>
  );
}
export default Search;