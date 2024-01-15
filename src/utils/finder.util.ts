
interface ListItem {
    value: string | number;
    label: string;
}
const findLabel = (list: ListItem[], value: string | number) => {
    const item = list.find((listItem) => listItem.value === value);
    return item?.label;
};

export { findLabel }
export type { ListItem }