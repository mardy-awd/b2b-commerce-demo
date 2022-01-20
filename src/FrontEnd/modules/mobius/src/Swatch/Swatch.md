### Swatch

## Example

```jsx
const swatchesList = [
    {
        isDisabled: false,
        type: "Color",
        value: "111",
        caption: "Item 1",
    },
    {
        isDisabled: true,
        type: "Color",
        value: "222",
        caption: "Item 2 (Disabled)",
    },
    {
        isDisabled: false,
        isSelected: true,
        type: "Color",
        value: "333",
        caption: "Item 3 (Selected)",
    },
];

<div style={{ display: "flex", justifyContent: "center"}}>
    {swatchesList.map((swatch, idx) => {
        return (
            <div key={idx} style={{ display: "flex", alignItems: "center" }}>
                <SwatchComponent {...swatch} />
            </div>
        );
    })}
<div/>;
```
