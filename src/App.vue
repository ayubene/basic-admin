<template>
  <div class="app-layout">
    <aside class="sidebar">
      <h1>Admin Starter</h1>
      <nav>
        <RouterLink to="/">Dashboard</RouterLink>
        <RouterLink to="/users">User Management</RouterLink>
        <RouterLink to="/products">Product Management</RouterLink>
        <RouterLink to="/accrued">Accrued Management</RouterLink>
        <RouterLink to="/settings">Settings</RouterLink>
      </nav>
      <div style="padding: 16px; font-size: 12px; opacity: 0.8">
        Powered by srit-basic-components
      </div>
    </aside>
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>
