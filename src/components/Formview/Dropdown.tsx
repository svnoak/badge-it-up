import { Divider, FormControl, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import styles from "@/styles/Dropdown.module.css";

export default function Dropdown({formtexts: {dropdown}, data: {answer, id}, question: {options}, _updateState}: {formtexts: { dropdown: string }, data: {answer: string, id: string}, question: {options: string[]}, _updateState: Function}){

  if( answer === "" ) answer = "-1";
  const [value, setValue] = useState<string>(answer);
  const [open, setOpen] = useState<boolean>(false);

  const handleChange = (event: SelectChangeEvent) => {
    let error = false;
    if( event.target.value == "-1" ) error = true;
    _updateState(id, event.target.value, error);
    setValue(event.target.value as string);
    setOpen(false);
  };

  useEffect(() => {
  }, [open])

  function handleClose(event: any){
    setOpen(false);
  }

  function handleOpen(event: any){
    setOpen(true);
  }
  
  return (
    <FormControl sx={{ m: 1, minWidth: 120, maxWidth: 300 }}>
      <Select
        value={value}
        onChange={handleChange}
        displayEmpty
        onOpen={handleOpen}
        onClose={handleClose}
        open={open}
        className={styles.select}
      >
        <MenuItem value={-1}><Typography color="text.secondary">{dropdown}</Typography></MenuItem> {/* change value to a non-empty string */}
        <Divider />
        {options.map((option:string, index: number) => (
          <MenuItem value={index} key={index}><Typography className={styles.menuItem}>{option}</Typography></MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}