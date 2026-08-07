import { TextField } from '@mui/material'

function FieldBox({ field, value, setValue }) {
    return (
        <TextField
            margin="normal"
            key={field}
            required
            fullWidth
            id={`${field}_id`}
            label={field}
            name={field}
            autoComplete={field}
            value={value}
            onChange={(e) => setValue(field, e.target.value)}
            type={field === "phone" ? "tel" : "text"}
        />
    )
}

export default FieldBox
