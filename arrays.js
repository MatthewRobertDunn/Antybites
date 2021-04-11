export function arrayRemove(array, entity) {
    //weird high performance array remove
    let index = array.findIndex(x => x == entity);
    if (index > -1) {
        if (array.length > 1 && index != array.length - 1) {
            array[index] = array.pop();
        } else {
            array.pop();
        }
        return true;
    }
    return false;
}
