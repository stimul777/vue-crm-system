import firebase from "firebase/app";

export default {
  actions: {
    // получить все категории с базы
    async fetchCategories({ commit, dispatch }) {
      try {
        const uid = await dispatch("getUid");
        const categories =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/categories`)
              .once("value")
          ).val() || {};
        return Object.keys(categories).map(key => ({
          ...categories[key],
          id: key
        }));
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },

    // получить 1 категорию по ID
    async fetchCategoriyByID({ commit, dispatch }, id) {
      try {
        const uid = await dispatch("getUid");
        const categoriy =
          (
            await firebase
              .database()
              .ref(`/users/${uid}/categories`)
              .child(id)
              .once("value")
          ).val() || {};
        return { ...categoriy };
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },

    // обновить категорию
    async updateCategory({ commit, dispatch }, { id, title, limit }) {
      try {
        const uid = await dispatch("getUid");
        await firebase
          .database()
          .ref(`/users/${uid}/categories`)
          .child(id)
          .update({ title, limit });
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    },

    async createCategory({ commit, dispatch }, { title, limit }) {
      try {
        const uid = await dispatch("getUid");
        const category = await firebase
          .database()
          .ref(`/users/${uid}/categories`)
          .push({ title, limit });
        return { title, limit, id: category.key };
      } catch (error) {
        commit("setError", error);
        throw error;
      }
    }
  }
};
