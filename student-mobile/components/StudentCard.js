import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function StudentCard({ student, onEdit, onDelete }) {
  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.initial}>
          {student.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.name}>{student.name}</Text>
        <Text style={styles.email}>{student.email}</Text>
        <Text style={styles.age}>Âge : {student.age}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity onPress={() => onEdit(student)}>
          <Text style={styles.edit}>Modifier</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onDelete(student.id)}>
          <Text style={styles.delete}>Supprimer</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  initial: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  info: { flex: 1, marginLeft: 12 },
  name: { fontSize: 16, fontWeight: 'bold' },
  email: { fontSize: 14, color: '#6B7280' },
  age: { fontSize: 14, color: '#4c6ef5' },
  actions: { alignItems: 'flex-end', gap: 8 },
  edit: { color: '#4c6ef5', fontWeight: '600' },
  delete: { color: '#ef4444', fontWeight: '600' },
});