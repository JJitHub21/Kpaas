import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from '../style/NewsSectionStyle';

const newsItems = [
  { id: 1, title: '학계·전문가 등 노인 연령 65→70세\n기초연금 수급 2040년 70세 제안', active: true },
  { id: 2, title: '', active: false },
  { id: 3, title: '', active: false },
  { id: 4, title: '', active: false },
  { id: 5, title: '', active: false },
];

const NewsSection = () => (
  <View style={styles.section}>
    <Text style={styles.title}>오늘의 소식</Text>
      <View style={styles.card}>
        <Image source={require('../image/selected-news.png')} style={styles.image} />
      </View>
      <Text style={styles.newsText}>{newsItems[0].title}</Text>
      <View style={styles.pagination}>
        {newsItems.map(item => (
          <View key={item.id} style={[styles.dot, item.active ? styles.activeDot : styles.inactiveDot]} />
        ))}
      </View>
      <TouchableOpacity style={styles.moreButton}>
        <Text style={styles.moreButtonText}>더보기</Text>
      </TouchableOpacity>
  </View>
);

export default NewsSection;
