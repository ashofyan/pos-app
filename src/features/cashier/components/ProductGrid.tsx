import React from 'react';

import {
  FlatList,
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';

import {AccountingProduct} from '../types/product.types';

interface Props {
  products: AccountingProduct[];
  columns?: number;
  contentContainerStyle?: ViewStyle;
  onProductPress?: (product: AccountingProduct) => void;
}

export default function ProductGrid({
  products,
  columns = 2,
  contentContainerStyle,
  onProductPress,
}: Props) {
  const renderProduct = ({item}: {item: AccountingProduct}) => {
    const imageUrl =
      item.item_photo && item.item_photo.trim() !== '' ? item.item_photo : null;

    return (
      <TouchableOpacity
        activeOpacity={0.85}
        style={styles.card}
        onPress={() => onProductPress?.(item)}>
        {imageUrl ? (
          <Image
            source={{
              uri: imageUrl,
            }}
            style={styles.image}
          />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <Text numberOfLines={2} style={styles.name}>
          {item.item_name}
        </Text>

        <Text style={styles.price}>
          Rp {Number(item.selling_price).toLocaleString('id-ID')}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={products}
      keyExtractor={item => item.id.toString()}
      renderItem={renderProduct}
      numColumns={columns}
      key={columns}
      contentContainerStyle={[styles.content, contentContainerStyle]}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,

    backgroundColor: '#FFFFFF',

    borderRadius: 8,

    padding: 0,

    margin: 8,

    elevation: 3,
  },

  image: {
    width: '100%',
    height: 135,

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,

    backgroundColor: '#E5E7EB',
  },

  imagePlaceholder: {
    width: '100%',
    height: 135,

    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,

    backgroundColor: '#EEEEEE',

    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderText: {
    color: '#B8B8B8',

    fontSize: 15,
  },

  name: {
    marginTop: 12,
    paddingHorizontal: 10,

    fontWeight: '600',

    color: '#000000',

    minHeight: 22,
    textAlign: 'center',
  },

  price: {
    marginTop: 4,
    marginBottom: 14,
    paddingHorizontal: 10,

    color: '#000000',

    fontWeight: '500',

    fontSize: 14,
    textAlign: 'center',
  },

  content: {
    paddingBottom: 120,
  },
});
