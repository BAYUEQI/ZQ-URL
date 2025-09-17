<script setup>
import { BloggerIcon, GitHubIcon, GmailIcon, TelegramIcon } from 'vue3-simple-icons'

const { title, email, telegram, blog, github } = useAppConfig()
</script>

<template>
  <section class="md:pt-6">
    <div class="container flex flex-col items-center py-8 mx-auto sm:flex-row">
      <a
        href="https://nav.520jacky.dpdns.org"
        class="text-xl font-black leading-none text-gray-900 select-none dark:text-gray-100 logo"
        :title="title"
      >{{ title }}</a>
      <span
        class="inline-flex justify-center mt-4 space-x-5 sm:ml-auto sm:mt-0 sm:justify-start"
      >
        <a
          v-if="email"
          :href="`mailto:${email}`"
          title="Email"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">{{ $t('layouts.footer.social.email') }}</span>
          <GmailIcon
            class="w-6 h-6"
          />
        </a>
        <a
          v-if="telegram"
          :href="telegram"
          target="_blank"
          title="Telegram"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">{{ $t('layouts.footer.social.telegram') }}</span>
          <TelegramIcon
            class="w-6 h-6"
          />
        </a>
        <a
          v-if="blog"
          :href="blog"
          target="_blank"
          title="Blog"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">{{ $t('layouts.footer.social.blog') }}</span>
          <BloggerIcon
            class="w-6 h-6"
          />
        </a>

        <a
          v-if="github"
          :href="github"
          target="_blank"
          title="GitHub"
          class="text-gray-400 hover:text-gray-500"
        >
          <span class="sr-only">{{ $t('layouts.footer.social.github') }}</span>
          <GitHubIcon
            class="w-6 h-6"
          />
        </a>
      </span>
    </div>
  </section>
</template>
