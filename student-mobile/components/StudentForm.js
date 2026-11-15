import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const empty = { name: '', email: '', age: '' };

export default function StudentForm({ student, onSave, onCancel }) {
  const [form, setForm] = useState(
    student
      ? { name: student.name, email: student.email, age: String(student.age) }
      : empty
  );

  const submit = async () => {
    const ok = await onSave(form);
    if (ok && !student) setForm(empty);
  };

  return (
    <View style={styles.form}>
      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={form.name}
        onChangeText={(t) => setForm({ ...form, name: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={form.email}
        onChangeText={(t) => setForm({ ...form, email: t })}
      />
      <TextInput
        style={styles.input}
        placeholder="Âge"
        keyboardType="numeric"
        value={form.age}
        onChangeText={(t) => setForm({ ...form, age: t })}
      />
      <Button title={student ? 'Enregistrer' : 'Ajouter un étudiant'} onPress={submit} />
      {student && <Button title="Annuler" color="#6B7280" onPress={onCancel} />}
    </View>
  );
}

const styles = StyleSheet.create({
  form: { marginBottom: 16, gap: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
});