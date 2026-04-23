# Location Import

Use this one-time import path to load LGAs, wards, and polling units from a cleaned CSV instead of creating them manually in the dashboard.

## CSV format

Required headers:

- `lga_code`
- `lga_name`
- `ward_code`
- `ward_name`
- `polling_unit_code`
- `polling_unit_name`
- `address`

Optional headers:

- `registered_voters`
- `lga_description`
- `ward_description`

Each row represents one polling unit.

Sample file:

- [data/location-import.sample.csv](./data/location-import.sample.csv)

## Command

From the `backend` folder:

```bash
npm run import:locations -- --file .\data\kano-locations.csv
```

To wipe existing location tables first and replace them:

```bash
npm run import:locations -- --file .\data\kano-locations.csv --replace
```

## What the script does

- creates or updates LGAs by `lga_code`
- creates or updates wards by `lga_code + ward_code`
- creates or updates polling units by `polling_unit_code`
- preserves hierarchy automatically

## Recommended workflow

1. Clean the INEC source into CSV.
2. Test with a small sample first.
3. Run the full import.
4. Use the admin UI only for small corrections afterward.
