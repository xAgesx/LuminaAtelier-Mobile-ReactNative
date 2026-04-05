import { StyleSheet, Text, TextInput, View } from 'react-native'

const Search = () => {
    return (
        <View>
            <View style={styles.searchSection}>
                <Search size={18} color="#94a3b8" style={styles.searchIcon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search"
                    placeholderTextColor="#94a3b8"
                />
            </View>
        </View>
    )
}

export default Search

const styles = StyleSheet.create({
    searchSection: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 12,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        height: 45,
        fontSize: 16,
        color: '#1e293b',
    },
})