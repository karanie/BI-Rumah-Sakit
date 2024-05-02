<template>
    <div class="card flex justify-content-center">
        <Button type="button" icon="pi pi-filter" label="Date Filter" @click="toggle" />

        <OverlayPanel ref="op">
            <div class="flex flex-column gap-5 w-25rem">
                <div>
                    <div>
                        <RadioButton v-model="pizza" inputId="ingredient1" name="pizza" value="Cheese" />
                        <label for="ingredient1" class="ml-2">Filter Relatif</label l>

                        <div class="card flex justify-content-center">
                            <CascadeSelect v-model="selectedCity" :options="countries" optionLabel="name"
                                optionGroupLabel="name" :optionGroupChildren="['states']" style="min-width: 14rem"
                                placeholder="Select a City">
                            </CascadeSelect>
                        </div>
                    </div>
                    <div>
                        <RadioButton v-model="pizza" inputId="ingredient2" name="pizza" value="Mushroom" />
                        <label for="ingredient2" class="ml-2">Filter Statis</label>

                        <div class="card flex justify-content-center">
                            <CascadeSelect v-model="selectedCity" :options="countries" optionLabel="name"
                                optionGroupLabel="name" :optionGroupChildren="['states']" style="min-width: 14rem"
                                placeholder="Select a City">
                            </CascadeSelect>
                        </div>
                    </div>

                    <div>
                        <RadioButton v-model="pizza" inputId="ingredient3" name="pizza" value="Mushroom2" />
                        <label for="ingredient3" class="ml-2">Filter Statis</label>

                        <div class="card flex justify-content-center">
                            <CascadeSelect v-model="selectedCity" :options="countries" optionLabel="name"
                                optionGroupLabel="name" :optionGroupChildren="['states']" style="min-width: 14rem"
                                placeholder="Select a City">
                            </CascadeSelect>
                        </div>
                    </div>
                </div>
            </div>
        </OverlayPanel>
    </div>
</template>

<script setup>


const pizza = ref();

const op = ref();

const toggle = (event) => {
    op.value.toggle(event);
}

const selectedCity = ref();


const countries = ref([
    {
        name: 'Hari',
        code: 'AU',
        states: [
            { name: 'New South Wales' },
            { name: 'Queensland' },
        ]
    },
    {
        name: 'Bulan',
        code: 'CA',
        states: [
            { name: 'Quebec' },
            { name: 'Ontario' }
        ]
    },
    {
        name: 'Kuarter',
        code: 'US',
        states: [
            { name: 'California' },
            { name: 'Florida' },
            { name: 'Texas' }
        ]
    },
    {
        name: 'Tahun',
        code: 'US',
        states: [
            { name: 'California' },
            { name: 'Florida' },
            { name: 'Texas' }
        ]
    }
]);

</script>
