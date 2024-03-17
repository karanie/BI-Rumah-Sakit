<template>
  <pre style="width:800px; overflow: auto">
Status: {{ auth.status }}
Data: {{ auth.data }}
Token: {{ auth.token }}
Last refreshed: {{ auth.lastRefreshedAt }}
  </pre>
</template>

<script setup lang="ts">
const auth = useAuth();
</script>
