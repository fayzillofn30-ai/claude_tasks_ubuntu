import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { additionalStore, featuresStore, PropertyStore } from '../../store/Property-store';
import { useEffect, useState } from 'react';
import { apiStore } from '../../service/api';

export function Additionals() {

  const [buildType, setBuildType] = useState("")
  const [lotDimensions, setLotDimensions] = useState({ "A": 0, "B": 0 })
  const { additionalData, setAdditionalData, resetAdditionalData } = additionalStore()
  const { propertyData, setPropertyData, resetPropertyData } = PropertyStore()
  const { featuresData, setFeaturesData, resetFeatures } = featuresStore()
  const [buildTypes, setBuildTypes] = useState([])
  const target = {
    propertyId: "",
    label: "",
    material: "",
    beds: 0,
    baths: 0,
    garages: 0,
    garageSize: 0,
    year_build: 2025,
    homeArea: 1200,
    lotDimensions: "",
    lotArea: 0,
    buildTypeId: ""
  }

  const handleChange = (field, e) => {
    const value = e.target.value
    setAdditionalData("lotDimensions", `${lotDimensions.A}x${lotDimensions.B}`)
    setAdditionalData(field, value)
  }

  useEffect(() => {
    apiStore.getState().api.get("/build-type/get-all").then(req => {
      const { data: buildTypes } = req.data
      console.log(buildTypes)
      setBuildTypes(buildTypes)
    }).catch(err => {
      console.log(err)
    })
  }, [])

  return (
    <div className="container mx-auto grid grid-cols-3 gap-x-5 gap-y-6 p-6 shadow-2xl">
      <div className="flex">
        <TextField label="Price" required type='number' value={propertyData.price} onChange={(e) => setPropertyData("price", e.target.value)}></TextField>
        <TextField label="Discount" required type='number' value={propertyData.discount} onChange={(e) => setPropertyData("discount", e.target.value)}></TextField>
      </div>
      <TextField
        label="Label"
        required
        value={additionalData.label}
        onChange={(e) => handleChange("label", e)}
      ></TextField>
      <TextField
        label="Material"
        value={additionalData.material}
        onChange={(e) => handleChange("material", e)}
      ></TextField>
      <div>
        <Select
          fullWidth
          value={buildType || ""} // faqat id saqlash yaxshiroq
          onChange={(e) => {
            const { value } = e.target;
            const type = buildTypes.find(t => t.id === value);
            if (type) {
              setBuildType(type.id); // buildType = id
              setAdditionalData("buildTypeId", type.id);
            }
          }}
          displayEmpty
        >
          <MenuItem value="">
            <em>Build Type</em>
          </MenuItem>
          {buildTypes.map(type => (
            <MenuItem key={type.id} value={type.id}>
              {type.name}
            </MenuItem>
          ))}
        </Select>

      </div>
      <TextField
        type='number'
        label="Beds"
        required
        value={additionalData.beds}
        onChange={(e) => handleChange("beds", e)}
      ></TextField>
      <TextField
        type='number'
        label="Rooms"
        required
        value={additionalData.rooms}
        onChange={(e) => handleChange("rooms", e)}
      ></TextField>
      <TextField
        type='number'
        label="Baths"
        required
        value={additionalData.baths}
        onChange={(e) => handleChange("baths", e)}
      ></TextField>
      <TextField
        type='number'
        label="Garages"
        required
        value={additionalData.garages}
        onChange={(e) => handleChange("garages", e)}
      ></TextField>
      <TextField
        required
        type="number"
        placeholder="Year Build"
        value={additionalData.year_build}
        onChange={(e) => handleChange("year_build", e)}
      />
      <TextField
        label="Home Area"
        required
        value={additionalData.homeArea}
        onChange={(e) => handleChange("homeArea", e)}
      ></TextField>
      <div className='flex'>
        <TextField
          label="Lot dimension A"
          type='number'
          value={lotDimensions.A}
          onChange={(e) => setLotDimensions(prev => {
            return { ...prev, "A": e.target.value }
          })}
          required
        ></TextField>
        <TextField
          label="Lot dimension B"
          type='number'
          value={lotDimensions.B}
          onChange={(e) => setLotDimensions(prev => {
            return { ...prev, "B": e.target.value }
          })}
          required
        ></TextField>
      </div>
      <TextField
        label="Lot Area"
        required
        value={propertyData.lotArea}
        onChange={(e) => handleChange("lotArea", e)}
      ></TextField>
    </div>
  );
}
