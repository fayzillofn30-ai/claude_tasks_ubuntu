import { Button, InputAdornment, TextField } from '@mui/material'
import React from 'react'
import MapsHomeWorkTwoToneIcon from '@mui/icons-material/MapsHomeWorkTwoTone'
import SearchIcon from '@mui/icons-material/Search'

function SearchSection({ isDark }) {
  return (
    <div className="container mx-auto mt-7 px-4">
      {/* Grid responsiv */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
        {/* Input katta joy egallaydi */}
        <div className="sm:col-span-2 lg:col-span-3">
          <TextField
            fullWidth
            label="Enter address"
            placeholder="Enter an address, neighborhood, city, or ZIP code"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <MapsHomeWorkTwoToneIcon />
                </InputAdornment>
              ),
            }}
          />
        </div>

        {/* Tugmalar */}
        <Button
          variant="contained"
          sx={{
            backgroundColor: isDark ? 'black' : 'whitesmoke',
            color: isDark ? 'white' : 'black',
            display: 'flex',
            gap: 1,
          }}
        >
          <img src="./car-key 1.png" alt="" className="w-5 h-5" /> Status
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: isDark ? 'black' : 'whitesmoke',
            color: isDark ? 'white' : 'black',
            display: 'flex',
            gap: 1,
          }}
        >
          <img src="./price_1.png" alt="" className="w-5 h-5" /> Price
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: isDark ? 'black' : 'whitesmoke',
            color: isDark ? 'white' : 'black',
            display: 'flex',
            gap: 1,
          }}
        >
          <img src="./setting-lines.png" alt="" className="w-5 h-5" /> Advanced
        </Button>

        <Button
          variant="contained"
          sx={{
            backgroundColor: isDark ? 'black' : 'whitesmoke',
            color: isDark ? 'white' : 'black',
            display: 'flex',
            gap: 1,
          }}
        >
          <SearchIcon /> Search
        </Button>
      </div>
    </div>
  )
}

export default SearchSection
