<template>
   <v-container class="mx-auto px-4">
      <v-row>
         <v-col class="col-md-8 offset-md-2">
            <v-card outlined class="mt-6 pa-3 elevation-1">
               <v-row no-gutters>
                  <v-col>
                     <transition name="slide" type="transition" mode="out-in">
                        <router-view />
                     </transition>
                  </v-col>
               </v-row>
            </v-card>
         </v-col>
      </v-row>
   </v-container>
</template>
