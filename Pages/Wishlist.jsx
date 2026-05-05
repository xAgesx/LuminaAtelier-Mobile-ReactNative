import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
    ActivityIndicator,
    Alert
} from 'react-native';
import { ShoppingBag, Trash2, ArrowRight, Heart, Sparkles } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiFetch } from '../api'; // Assuming your api wrapper is here

const { width } = Dimensions.get('window');

const Wishlist = () => {
    const navigation = useNavigation();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    // 1. Fetch Wishlist on Mount
    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            // Assuming endpoint is /users/wishlist or /wishlist
            const response = await apiFetch('/users/wishlist', 'GET', null, token);
            
            if (response?.data) {
                setItems(response.data);
            }
        } catch (error) {
            console.error("Wishlist fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    // 2. Remove Item from Backend
    const removeItem = async (id) => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await apiFetch(`/users/wishlist/${id}`, 'DELETE', null, token);
            
            if (response) {
                // Update local state for immediate feedback
                setItems(prev => prev.filter(item => item._id !== id));
            }
        } catch (error) {
            Alert.alert("Error", "Could not remove item. Please try again.");
        }
    };

    // 3. Move Item to Cart/Bag
    const moveToBag = async (product) => {
        setActionLoading(true);
        try {
            const token = await AsyncStorage.getItem('token');
            
            // 1. Add to cart
            await apiFetch('/cart', 'POST', { 
                productId: product._id,
                quantity: 1 
            }, token);

            // 2. Remove from wishlist
            await removeItem(product._id);
            
            Alert.alert("Success", `${product.name} moved to your bag.`);
        } catch (error) {
            Alert.alert("Error", "Could not move item to bag.");
        } finally {
            setActionLoading(false);
        }
    };

    const totalValue = items.reduce((sum, item) => sum + item.price, 0);

    const renderWishlistItem = ({ item }) => (
        <View style={styles.card}>
            <TouchableOpacity
                style={styles.cardContent}
                onPress={() => navigation.navigate("Details", { product: item })}
            >
                <View style={styles.imageContainer}>
                    <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />
                </View>

                <View style={styles.details}>
                    <Text style={styles.materialText}>{item.material}</Text>
                    <Text style={styles.nameText}>{item.name}</Text>
                    <Text style={styles.priceText}>${item.price.toLocaleString()}</Text>

                    <View style={styles.cardActions}>
                        <TouchableOpacity 
                            style={styles.addToCartBtn} 
                            onPress={() => moveToBag(item)}
                            disabled={actionLoading}
                        >
                            <ShoppingBag size={14} color="#fff" />
                            <Text style={styles.addToCartText}>Move to Bag</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.deleteBtn}
                            onPress={() => removeItem(item._id)}
                        >
                            <Trash2 size={16} color="#94a3b8" />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#C5A059" />
                <Text style={styles.loadingText}>Opening your vault...</Text>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerTitle}>My Wishlist</Text>
                    <Text style={styles.headerSub}>{items.length} curated pieces</Text>
                </View>
                <TouchableOpacity style={styles.shareBtn}>
                    <Text style={styles.shareText}>Share List</Text>
                </TouchableOpacity>
            </View>

            {items.length > 0 ? (
                <>
                    <FlatList
                        data={items}
                        renderItem={renderWishlistItem}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.listPadding}
                        showsVerticalScrollIndicator={false}
                    />

                    <View style={styles.footer}>
                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Total Value</Text>
                            <Text style={styles.totalAmount}>${totalValue.toLocaleString()}</Text>
                        </View>
                        <TouchableOpacity 
                            style={[styles.checkoutBtn, actionLoading && { opacity: 0.7 }]}
                            onPress={() => Alert.alert("Bulk Action", "Moving all items to your bag...")}
                        >
                            <Text style={styles.checkoutBtnText}>Move All to Bag</Text>
                            <ArrowRight size={20} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </>
            ) : (
                <View style={styles.emptyState}>
                    <View style={styles.emptyIconContainer}>
                        <Heart size={40} color="#e2e8f0" strokeWidth={1} />
                    </View>
                    <Text style={styles.emptyTitle}>Your Wishlist is Empty</Text>
                    <Text style={styles.emptyDescription}>
                        Save your favorite pieces here to keep track of what you love.
                    </Text>
                    <TouchableOpacity
                        style={styles.exploreBtn}
                        onPress={() => navigation.navigate("Catalogue")}
                    >
                        <Sparkles size={18} color="#fff" style={{ marginRight: 8 }} />
                        <Text style={styles.exploreBtnText}>Start Discovering</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    loadingText: { marginTop: 10, color: '#94a3b8', fontSize: 12, letterSpacing: 1 },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: 25,
        paddingVertical: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
    },
    headerTitle: { fontSize: 28, fontWeight: '700', color: '#1a1a1a' },
    headerSub: { fontSize: 14, color: '#94a3b8', marginTop: 2 },
    shareBtn: {
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    shareText: { fontSize: 13, fontWeight: '600', color: '#64748b' },

    listPadding: { padding: 25, paddingBottom: 150 },
    card: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        overflow: 'hidden',
    },
    cardContent: { flexDirection: 'row', padding: 12 },
    imageContainer: {
        width: 100,
        height: 120,
        backgroundColor: '#f8fafc',
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: { width: '80%', height: '80%' },
    details: { flex: 1, marginLeft: 16, justifyContent: 'center' },
    materialText: { fontSize: 10, fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
    nameText: { fontSize: 17, fontWeight: '600', color: '#1a1a1a', marginTop: 2 },
    priceText: { fontSize: 16, fontWeight: '700', color: '#1a1a1a', marginTop: 4 },

    cardActions: { flexDirection: 'row', marginTop: 12, alignItems: 'center', gap: 10 },
    addToCartBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 10,
        gap: 6,
    },
    addToCartText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    deleteBtn: {
        padding: 8,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
    },

    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        padding: 25,
        paddingBottom: 40,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 10,
    },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    summaryLabel: { fontSize: 14, color: '#64748b', fontWeight: '500' },
    totalAmount: { fontSize: 22, fontWeight: '800', color: '#1a1a1a' },
    checkoutBtn: {
        backgroundColor: '#1a1a1a',
        flexDirection: 'row',
        height: 64,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    checkoutBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

    emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
    emptyIconContainer: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
    },
    emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1a1a1a', marginBottom: 8 },
    emptyDescription: { fontSize: 15, color: '#94a3b8', textAlign: 'center', lineHeight: 22, marginBottom: 32 },
    exploreBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#1a1a1a',
        paddingHorizontal: 24,
        paddingVertical: 16,
        borderRadius: 16,
    },
    exploreBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});

export default Wishlist;