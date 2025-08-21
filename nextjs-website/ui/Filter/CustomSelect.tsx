/* eslint-disable unused-imports/no-unused-vars */
import { FormControl, MenuItem, styled, Typography } from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ReactNode, useEffect, useState } from "react";

type CustomSelectProps = {
  initialValue?: string;
  disabled?: boolean;
  label?: string;
  isLabel?: boolean;
  icon?: ReactNode;
  value?: string;
  onChange?: any;
  children: ReactNode;
};

export const FormControlWrapper = styled(FormControl)`
  width: 100%;
  .location {
    font-size: 14px;
    font-weight: 400;
    color: #565656;
  }
`;

const CustomSelectWrapper = styled(Select)`
  &.MuiInputBase-root {
    background-color: white;
    width: 100%;
    border-radius: 6px;
    border: 1px solid rgba(45, 45, 45, 0.2);
    min-height: 60px;
    min-width: 177px;

    @media (max-width: 599px) {
      min-height: 40px;
    }

    .MuiSelect-select {
      background-color: white;
      padding: 16.5px 14px;
      color: black;
      font-size: 14px;
      font-weight: 400;
      text-align: left;

      @media (max-width: 599px) {
        padding: 7.5px 7px;
      }
    }
  }

  fieldset {
    display: none;
  }

  .MuiSelect-icon {
    padding: 0;
    line-height: 0;
    top: 50%;
    transform: translateY(-50%);
    right: 20px;
  }

  .menu_item {
    &.MuiMenuItem-root {
      color: black;
    }
  }
`;

const CustomSelect: React.FC<CustomSelectProps> = ({
  initialValue = "",
  disabled = false,
  label,
  isLabel = false,
  icon,
  value: propValue = "",
  onChange = () => {},
  children,
  ...props
}) => {
  const MenuProps = {
    PaperProps: {
      style: {
        width: "auto"
      }
    }
  };

  const [value, setValue] = useState<string>(propValue);

  const handleChange = (event: SelectChangeEvent<any>) => {
    const newValue = event.target.value;
    setValue(newValue);
    if (onChange) {
      onChange(newValue); // ✅ Check if `onChange` exists before calling
    }
  };
  useEffect(() => {
    setValue(propValue);
  }, [propValue]);

  return (
    <FormControlWrapper>
      {isLabel && (
        <Typography variant="body1" className="input_head">
          {label}
        </Typography>
      )}

      <CustomSelectWrapper
        disabled={disabled}
        displayEmpty
        input={<OutlinedInput />}
        // IconComponent={(iconProps) => (
        //     <IconButton {...iconProps}>{icon || <DropdownIcon2 />}</IconButton>
        // )}
        value={value}
        onChange={handleChange}
        MenuProps={MenuProps}
        inputProps={{ "aria-label": "Without label" }}
        {...props}
      >
        <MenuItem value="" sx={{ display: "none" }}>
          {initialValue}
        </MenuItem>
        {children}
      </CustomSelectWrapper>
    </FormControlWrapper>
  );
};

export default CustomSelect;
