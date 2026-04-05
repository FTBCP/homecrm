import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Auth hook — manages Supabase session state.
 * Returns { user, homeId, loading, signUp, signIn, signOut }
 *
 * On first signup, auto-creates a `homes` row for the user.
 */
export function useAuth() {
  const [user, setUser] = useState(null);
  const [homeId, setHomeId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load or create the user's home
  const loadHome = useCallback(async (userId) => {
    const { data, error } = await supabase
      .from('homes')
      .select('id')
      .eq('user_id', userId)
      .limit(1);

    if (error) {
      console.error('Failed to load home:', error.message);
      return null;
    }

    if (data && data.length > 0) {
      setHomeId(data[0].id);
      return data[0].id;
    }

    // First login — auto-create a home
    const { data: newHome, error: createError } = await supabase
      .from('homes')
      .insert({ user_id: userId })
      .select('id');

    if (createError) {
      console.error('Failed to create home:', createError.message);
      return null;
    }

    const id = newHome[0].id;
    setHomeId(id);
    return id;
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setLoading(false);
      }
    });

    // Subscribe to changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          setUser(null);
          setHomeId(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Separate effect to load home when user changes
  useEffect(() => {
    if (user && !homeId) {
      loadHome(user.id).finally(() => {
        setLoading(false);
      });
    }
  }, [user, homeId, loadHome]);

  const signUp = async (email, password) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { success: false, error: error.message };
    // If email confirmation is disabled, user is immediately signed in
    if (data.user && !data.user.identities?.length) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    return { success: true, needsConfirmation: !data.session };
  };

  const signIn = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHomeId(null);
  };

  return { user, homeId, loading, signUp, signIn, signOut };
}
