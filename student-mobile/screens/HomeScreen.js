import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, Platform, StyleSheet } from 'react-native';
import StudentCard from '../components/StudentCard';
import StudentForm from '../components/StudentForm';

// Web: localhost. Phone: replace with YOUR PC IPv4 (ipconfig)
const API = 'http://localhost:8000/students';

const notify = (title, message) => {
  if (Platform.OS === 'web') window.alert(`${title}: ${message}`);
  else Alert.alert(title, message);
};

export default function HomeScreen() {
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(null);

  const load = async () => {
    try {
      const response = await fetch(API);
      setStudents(await response.json());
    } catch (e) {
      notify('Erreur', 'Impossible de joindre l’API');
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (form) => {
    try {
      const response = await fetch(editing ? `${API}/${editing.id}` : API, {
        method: editing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, age: Number(form.age) }),
      });
      if (!response.ok) {
        notify('Erreur', 'Données invalides (âge entre 1 et 120)');
        return false;
      }
      setEditing(null);
      load();
      return true;
    } catch (e) {
      notify('Erreur', 'Impossible de joindre l’API');
      return false;
    }
  };

  const doDelete = async (id) => {
    try {
      await fetch(`${API}/${id}`, { method: 'DELETE' });
      load();
    } catch (e) {
      notify('Erreur', 'Impossible de joindre l’API');
    }
  };

  const remove = (id) => {
    if (Platform.OS === 'web') {
      if (window.confirm('Supprimer cet étudiant ?')) doDelete(id);
      return;
    }
    Alert.alert('Supprimer', 'Supprimer cet étudiant ?', [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', style: 'destructive', onPress: () => doDelete(id) },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Étudiants</Text>
      <StudentForm
        key={editing ? editing.id : 'new'}
        student={editing}
        onSave={save}
        onCancel={() => setEditing(null)}
      />
      <FlatList
        data={students}
        keyExtractor={(item) => String(item.id)}
        keyboardShouldPersistTaps="handled"
        renderItem={({ item }) => (
          <StudentCard student={item} onEdit={setEditing} onDelete={remove} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, paddingTop: 56, backgroundColor: '#f8f9ff' },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4c6ef5',
    marginBottom: 16,
    textAlign: 'center',
  },
});