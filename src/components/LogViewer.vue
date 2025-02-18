<template>
  <div class="container">
    <h1>P2P Client Logs</h1>
    <div class="log-container">
      <pre>{{ logs }}</pre>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from "vue";

export default {
  setup() {
    const logs = ref("");
    let socket;

    onMounted(() => {
      socket = new WebSocket("ws://localhost:5000");
      socket.onmessage = (event) => (logs.value = event.data);
      socket.onerror = (error) => console.error("WebSocket Error:", error);
    });

    onUnmounted(() => socket && socket.close());

    return { logs };
  },
};
</script>

<style>
.container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
}
.log-container {
  background: #222;
  color: #fff;
  padding: 15px;
  height: 400px;
  overflow-y: auto;
  border-radius: 5px;
}
</style>
