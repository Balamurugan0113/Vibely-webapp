import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gepajhpnlkfaohudavja.supabase.co'
const supabaseKey = 'sb_publishable_0VIeoxYP3G8cRPZwICSTqA_FGCv9EYb'
const supabase = createClient(supabaseUrl, supabaseKey)

const songs = [
  {
    title: 'Nattu Saraku',
    artist: 'Unknown',
    album: 'Hits',
    cover_url: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80&w=400',
    audio_url: 'https://res.cloudinary.com/xygw1utm/video/upload/v1790311763/Nattu-Saraku.mp3'
  },
  {
    title: 'Alai Paayum',
    artist: 'Unknown',
    album: 'Hits',
    cover_url: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?auto=format&fit=crop&q=80&w=400',
    audio_url: 'https://res.cloudinary.com/xygw1utm/video/upload/v1790311761/Alai-Paayum.mp3'
  },
  {
    title: 'Oru Vaanavillin Pakkathilae',
    artist: 'Unknown',
    album: 'Melodies',
    cover_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80&w=400',
    audio_url: 'https://res.cloudinary.com/xygw1utm/video/upload/v1790311736/Oru-Vaanavillin-Pakkathilae.mp3'
  },
  {
    title: 'Enna Enna Aagiraen',
    artist: 'Unknown',
    album: 'Melodies',
    cover_url: 'https://images.unsplash.com/photo-1493225457124-a1a2a5956093?auto=format&fit=crop&q=80&w=400',
    audio_url: 'https://res.cloudinary.com/xygw1utm/video/upload/v1790311742/Enna-Enna-Aagiraen.mp3'
  }
];

async function seed() {
  console.log('Inserting sample songs...');
  const { data, error } = await supabase.from('songs').insert(songs);
  if (error) {
    console.error('Error:', error.message);
  } else {
    console.log('Successfully added songs!');
  }
}

seed();
